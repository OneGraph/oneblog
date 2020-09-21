// @flow

import unified from 'unified';
import parse from 'remark-parse';

const markdownParser = unified()
  .use({settings: {position: false}})
  .use(parse);

const memo: Map<string, Unified$Node> = new Map();
const MAX_ENTRIES = 100;

export default function parseMarkdown(markdown: string): Unified$Node {
  const fromCache = memo.get(markdown);
  if (fromCache) {
    return fromCache;
  }
  const res = markdownParser.parse(markdown);
  memo.set(markdown, res);
  if (memo.size > MAX_ENTRIES) {
    const firstKey = memo.keys().next().value;
    if (firstKey) {
      memo.delete(firstKey);
    }
  }
  return res;
}
