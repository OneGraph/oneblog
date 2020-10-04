// @flow

import parseMarkdown from './parseMarkdown';

type Tokens = Array<{
  text: string,
  foregroundColor: string,
  backgroundColor: string,
}>;

type TokenInfo = {
  tokens: Tokens,
  backgroundColor: string,
  foregroundColor: string,
};

// Map from code to token infos
// Assumes identical code blocks should match the same lanugage
export const TOKEN_INFO_CACHE: Map<string, TokenInfo> = new Map();

export function registerTokenInfo({
  code,
  tokenInfo,
}: {
  code: string,
  tokenInfo: TokenInfo,
}) {
  if (TOKEN_INFO_CACHE.get(code)) {
    return;
  }
  TOKEN_INFO_CACHE.set(code, tokenInfo);
  if (TOKEN_INFO_CACHE.size > 5000) {
    TOKEN_INFO_CACHE.delete(TOKEN_INFO_CACHE.keys().next().value);
  }
}

export function fetchTokenInfo({
  code,
  language,
}: {
  code: string,
  language?: ?string,
}): TokenInfo | Promise<TokenInfo> {
  const fromCache = TOKEN_INFO_CACHE.get(code);
  if (fromCache) {
    return fromCache;
  }
  const getUrl = `https://sourcecodeshots.com/api/token-info?code=${encodeURIComponent(
    code,
  )}&theme=tomorrow-night-blue&language=${language ? language : ''}`;
  const resp =
    getUrl.length < 2083
      ? fetch(getUrl, {
          method: 'GET',
          accept: 'application/json',
        })
      : fetch('https://sourcecodeshots.com/api/token-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application.json',
          },
          body: JSON.stringify({
            code,
            language: language,
            theme: 'tomorrow-night-blue',
          }),
        });
  return resp
    .then((r) => r.json())
    .then((tokenInfo) => {
      registerTokenInfo({code, tokenInfo});
      return tokenInfo;
    });
}

function findCodeNodes(roots: Array<Unified$Node>) {
  const nodes = [];
  function visit(node: Unified$Node) {
    if (node.type === 'code' && node.lang !== 'backmatter') {
      nodes.push(node);
    }
    if (node.children && node.children.length) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }
  for (const root of roots) {
    visit(root);
  }
  return nodes;
}

export async function tokenInfosFromMarkdowns({
  markdowns,
}: {
  markdowns: Array<string>,
}): {[code: string]: TokenInfo} {
  const res = {};
  const nodes = findCodeNodes(markdowns.map(parseMarkdown));
  const entries = await Promise.all(
    nodes.map(async (node) => {
      const code = node.value;
      const language = node.lang;
      const tokenInfo = await fetchTokenInfo({code: node.value, language});
      return [code, tokenInfo];
    }),
  );
  return Object.fromEntries(entries);
}
