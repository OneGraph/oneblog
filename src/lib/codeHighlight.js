// @flow

import parseMarkdown from './parseMarkdown';
import Config from '../config';

type Tokens = Array<{
  text: string,
  foregroundColor: string,
  backgroundColor: string,
}>;

export type TokenInfo = {
  tokens: Array<Tokens>,
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
    const firstKey = TOKEN_INFO_CACHE.keys().next().value;
    if (firstKey) {
      TOKEN_INFO_CACHE.delete(firstKey);
    }
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
  )}&theme=${Config.codeTheme}&language=${language ? language : ''}`;
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
            theme: Config.codeTheme,
          }),
        });
  return resp
    .then((r) => r.json())
    .then((tokenInfo) => {
      registerTokenInfo({code, tokenInfo});
      return tokenInfo;
    });
}

function findCodeNodes(roots: Array<any>) {
  const nodes = [];
  function visit(node: any) {
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

export const defaultThemeColors = {
  abyss: {backgroundColor: '#000c18', foregroundColor: 'white'},
  'dark-plus': {backgroundColor: '#1E1E1E', foregroundColor: '#D4D4D4'},
  'light-plus': {backgroundColor: '#FFFFFF', foregroundColor: '#000000'},
  'github-dark': {backgroundColor: '#24292e', foregroundColor: '#e1e4e8'},
  'github-light': {backgroundColor: '#fff', foregroundColor: '#24292e'},
  'visual-studio-dark': {
    backgroundColor: '#1E1E1E',
    foregroundColor: '#D4D4D4',
  },
  'visual-studio-light': {
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
  },
  'high-contrast': {backgroundColor: '#000000', foregroundColor: '#FFFFFF'},
  'kimbie-dark': {backgroundColor: '#221a0f', foregroundColor: '#d3af86'},
  'dimmed-monokai': {backgroundColor: '#1e1e1e', foregroundColor: '#c5c8c6'},
  monokai: {backgroundColor: '#272822', foregroundColor: '#f8f8f2'},
  quietlight: {backgroundColor: '#F5F5F5', foregroundColor: 'white'},
  red: {backgroundColor: '#390000', foregroundColor: '#F8F8F8'},
  'solarized-dark': {backgroundColor: '#002B36', foregroundColor: 'white'},
  'solarized-light': {backgroundColor: '#FDF6E3', foregroundColor: 'white'},
  'tomorrow-night-blue': {
    backgroundColor: '#002451',
    foregroundColor: '#ffffff',
  },
};
