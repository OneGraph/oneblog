import appConfig from '../../config';

export default (req, res) => {
  let siteHostname = appConfig.siteHostname;

  if (!siteHostname) {
    console.warn(
      'set NEXT_PUBLIC_SITE_HOSTNAME environment variable to ensure that sitemap urls are correct',
    );
    siteHostname = `https://${req.headers.host}`;
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3000, s-maxage=3000');

  const body = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /static/

Sitemap: ${siteHostname}/sitemap.xml
`.trim();

  res.status(200).send(body);
};
