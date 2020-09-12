import {buildFeed} from '../../../RssFeed';
import appConfig from '../../../config';

export const config = {
  api: {
    externalResolver: true,
  },
};

const SUPPORTED_FEED_EXTENSIONS = ['rss', 'atom', 'json'];

export default async (req, res) => {
  const extension = req.query.ext;
  if (!SUPPORTED_FEED_EXTENSIONS.includes(extension)) {
    res
      .status(404)
      .send('Unknown feed URL. Try feed.json, feed.rss, or feed.atom');
    return;
  }

  const feed = await buildFeed({
    basePath: '/',
    siteHostname: appConfig.siteHostname,
  });
  const body =
    extension === 'rss'
      ? feed.rss2()
      : extension === 'atom'
      ? feed.atom1()
      : feed.json1();
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.setHeader(
    'Content-Type',
    extension === 'json' ? 'application/json' : 'application/xml',
  );
  res.status(200).send(body);
};
