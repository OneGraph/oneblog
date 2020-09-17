// @flow

import unified from 'unified';
import parse from 'remark-parse';

const markdownParser = unified()
  .use({settings: {position: false}})
  .use(parse);

const memo = new Map();
const MAX_ENTRIES = 100;

export default function parseMarkdown(markdown: string) {
  if (memo.has(markdown)) {
    return memo.get(markdown);
  }
  const res = markdownParser.parse(markdown);
  memo.set(markdown, res);
  if (memo.size > MAX_ENTRIES) {
    memo.delete(memo.keys().next().value);
  }
  return res;
}
