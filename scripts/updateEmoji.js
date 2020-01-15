const fs = require('fs');
const cheerio = require('cheerio');

// Before running this, dump the html from
// https://github.com/autocomplete/emoji to
// /emoji-dump.html

async function updateEmoji() {
  const emojiHtml = fs.readFileSync(`${__dirname}/../emoji-dump.html`, 'utf-8');
  const $ = cheerio.load(emojiHtml);

  const emoji = {};
  $('g-emoji').each(function(i, elem) {
    const $g = $(this);
    const alias = $g.attr('alias');
    if (emoji[alias]) {
      throw new Error('Duplicate for alias', alias);
    }
    emoji[alias] = $g.text();
  });

  fs.writeFileSync(
    `${__dirname}/../src/emoji.js`,
    `// @flow

const emoji = JSON.parse(
  '${JSON.stringify(emoji)}',
);

export default emoji;
`,
  );
}

updateEmoji();
