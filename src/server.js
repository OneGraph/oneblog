// @flow

import App, {routes} from './App';
import React from 'react';
import {ServerLocation, isRedirect} from '@reach/router';
import {pick} from '@reach/router/lib/utils';
import {ServerStyleSheet} from 'styled-components';
import express from 'express';
import cookieParser from 'cookie-parser';
import {renderToString} from 'react-dom/server';
import {fetchQuery} from 'react-relay';
import {createEnvironment} from './Environment';
import serialize from 'serialize-javascript';
import {RecordSource} from 'relay-runtime';
import PreloadCacheContext from './PreloadCacheContext';
import PreloadCache from './preloadQueryCache';
import {buildFeed} from './RssFeed';
import {imageProxy, firstFrame} from './imageProxy';
import {Helmet} from 'react-helmet';
import config from './config';

// $FlowFixMe
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const siteHostname = process.env.RAZZLE_SITE_HOSTNAME || process.env.URL;

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

const MEDIUM_REGEX = /[0-9a-f]{8,16}$/;

function getMediumId(req) {
  const path = req.path;

  if (!path) {
    return null;
  }
  const match = path.match(MEDIUM_REGEX);

  if (match && match[0]) {
    return match[0];
  }
  return null;
}

async function findMediumRedirect(req): Promise<?number> {
  const mediumId = getMediumId(req);
  if (mediumId) {
    try {
      const res = await fetch(
        `https://medium-oneblog-importer-o3e76jeu3q-uc.a.run.app/redirects/${config.repoOwner}/${config.repoName}/${mediumId}`,
      );
      const json = await res.json();
      if (json.status === 'found' && json.issue && json.issue.number) {
        return json.issue.number;
      }
    } catch (e) {
      console.error('Error finding Medium redirect', e);
      return null;
    }
  }
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
        const mediumRedirectIssueNumber = await findMediumRedirect(req);
        if (mediumRedirectIssueNumber) {
          res.redirect(301, `/post/${mediumRedirectIssueNumber}`);
          return;
        }
        const recordSource = new RecordSource();

        let accessToken;
        try {
          const cookie = req.cookies[config.appId];
          if (cookie) {
            accessToken = JSON.parse(cookie).accessToken;
          }
        } catch (e) {
          console.error('Error parsing cookie', e);
        }

        const cache = new PreloadCache({size: 10, ttl: 1000 * 60 * 60});
        const environment = createEnvironment(
          recordSource,
          accessToken ? {Authorization: `Bearer ${accessToken}`} : null,
          cache,
        );

        // Prep cache
        const match = pick(routes, req.url);
        if (match) {
          await new Promise((resolve, reject) => {
            match.route
              .preload(cache, environment, match.params)
              .source.subscribe({
                complete: () => {
                  resolve();
                },
                error: e => reject(e),
              });
          });
        }

        const sheet = new ServerStyleSheet();

        const markup = renderToString(
          sheet.collectStyles(
            <ServerLocation url={req.url}>
              <PreloadCacheContext.Provider value={cache}>
                <App environment={environment} basepath={basePath || '/'} />
              </PreloadCacheContext.Provider>
            </ServerLocation>,
          ),
        );
        const helmet = Helmet.renderStatic();
        const styleTags = sheet.getStyleTags();
        if (accessToken) {
          res.set('Cache-Control', 'private, max-age=3600, s-maxage=3600');
        } else {
          res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        }
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
      } catch (e) {
        if (isRedirect(e)) {
          res.redirect(e.uri);
        } else {
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
      }
    });

  const server = express();
  return server
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .use(cookieParser())
    .use(basePath || '/', appRouter);
}

export default createApp;
