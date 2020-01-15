// @flow

import App, {routes} from './App';
import React from 'react';
import {StaticRouter, matchPath} from 'react-router-dom';
import {ServerStyleSheet} from 'styled-components';
import express from 'express';
import {renderToString} from 'react-dom/server';
import {fetchQuery} from 'react-relay';
import {createEnvironment} from './Environment';
import serialize from 'serialize-javascript';
import {RecordSource} from 'relay-runtime';
import RelayQueryResponseCache from './relayResponseCache';
import {buildFeed} from './RssFeed';
import {imageProxy, firstFrame} from './imageProxy';
import {Helmet} from 'react-helmet';

// $FlowFixMe
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const siteHostname = process.env.RAZZLE_SITE_HOSTNAME;

function buildHtml({
  markup,
  styleTags,
  bootstrapData,
  basePath,
  htmlAttributes,
  title,
  meta,
}) {
  const bootstrapScript = bootstrapData
    ? `<script>
    window.__RELAY_BOOTSTRAP_DATA__ = JSON.parse(${serialize(
      JSON.stringify(bootstrapData),
      {isJSON: true},
    )})
  </script>`
    : '';
  return `<!doctype html>
<html lang="en" ${htmlAttributes}>
  <head>
    ${title}
    ${meta}
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" 
          title="RSS Feed" 
          href="${basePath ? basePath : ''}/feed.rss" />
    <link rel="alternate" 
          href="${basePath ? basePath : ''}/feed.atom" 
          title="Atom feed" 
          type="application/atom+xml" />

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />

    ${styleTags ? styleTags : ''}
    ${
      assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ''
    }
    ${
      process.env.NODE_ENV === 'production'
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`
    }
    ${
      process.env.NODE_ENV === 'production'
        ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-122815795-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-122815795-1');
</script>`
        : ''
    }
  </head>
  <body>
    <div id="root">${markup ? markup : ''}</div>
    <script>window.__basename__ = "${basePath || '/'}";</script>
    ${bootstrapScript ? bootstrapScript : ''}
  </body>
</html>`;
}

const SUPPORTED_FEED_EXTENSIONS = ['rss', 'atom', 'json'];

function createApp(basePath: ?string) {
  const appRouter = express.Router();
  appRouter
    .get('/image/:base64Url', imageProxy)
    .get('/image/firstFrame/:base64Url', firstFrame)
    .get('/feed.:ext', async (req, res) => {
      const extension = req.params.ext;
      if (!SUPPORTED_FEED_EXTENSIONS.includes(extension)) {
        res
          .status(404)
          .send('Unknown feed URL. Try feed.json, feed.rss, or feed.atom');
        return;
      }

      const feed = await buildFeed({basePath, siteHostname});
      const body =
        extension === 'rss'
          ? feed.rss2()
          : extension === 'atom'
          ? feed.atom1()
          : feed.json1();
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
      res.set(
        'Content-Type',
        extension === 'json' ? 'application/json' : 'application/xml',
      );
      res.status(200).send(body);
    })
    .get('/*', async (req, res) => {
      try {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
        const recordSource = new RecordSource();
        const cache = new RelayQueryResponseCache({
          size: 250,
          ttl: 1000 * 60 * 10,
        });
        const environment = createEnvironment(recordSource, cache);

        // Prep cache
        for (const routeConfig of routes) {
          const match = matchPath(req.path, routeConfig);
          if (match) {
            // Makes relay put result of the query into the record store
            await fetchQuery(
              environment,
              routeConfig.query,
              routeConfig.getVariables(match),
            );
            break;
          }
        }

        const sheet = new ServerStyleSheet();
        const context = {};

        const markup = renderToString(
          sheet.collectStyles(
            <StaticRouter context={context} location={req.url}>
              <App environment={environment} />
            </StaticRouter>,
          ),
        );
        const helmet = Helmet.renderStatic();
        const styleTags = sheet.getStyleTags();
        if (context.url) {
          res.redirect(context.url);
        } else {
          res.status(200).send(
            buildHtml({
              markup,
              styleTags,
              bootstrapData: recordSource.toJSON(),
              basePath,
              htmlAttributes: helmet.htmlAttributes.toString(),
              title: helmet.title.toString(),
              meta: helmet.meta.toString(),
            }),
          );
        }
      } catch (e) {
        console.error(e);
        res.status(200).send(
          buildHtml({
            markup: null,
            styleTags: null,
            bootstrapData: null,
            basePath,
            htmlAttributes: '',
            title: '',
            meta: '',
          }),
        );
      }
    });

  const server = express();
  return server
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .use(basePath || '/', appRouter);
}

export default createApp;
