import {buildFeed} from '../../../RssFeed';
import appConfig from '../../../config';
import {subdomainFromReq} from '../../../lib/subdomain';

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

  let siteHostname = appConfig.siteHostname;

  if (!siteHostname) {
    siteHostname = `https://${req.headers.host}`;
  }

  const subdomain = subdomainFromReq(req);

  const feed = await buildFeed({
    basePath: '/',
    siteHostname,
    subdomain,
  });
  const body =
    extension === 'rss'
      ? feed.rss2()
      : extension === 'atom'
      ? feed.atom1()
      : feed.json1();

  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

  res.setHeader(
    'Content-Type',
    extension === 'json' ? 'application/json' : 'application/xml',
  );
  res.status(200).send(body);
};
