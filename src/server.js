import App, { routes } from "./App";
import React from "react";
import { StaticRouter, matchPath } from "react-router-dom";
import { ServerStyleSheet } from "styled-components";
import express from "express";
import { renderToString } from "react-dom/server";
import { fetchQuery } from "react-relay";
import { createEnvironment } from "./Environment";
import serialize from "serialize-javascript";
import { RecordSource } from "relay-runtime";
import RelayQueryResponseCache from "./relayResponseCache";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

function buildHtml({ markup, styleTags, bootstrapData }) {
  const bootstrapScript = bootstrapData
    ? `<script>
    window.__RELAY_BOOTSTRAP_DATA__ = JSON.parse(${serialize(
      JSON.stringify(bootstrapData),
      { isJSON: true }
    )})
  </script>`
    : "";
  return `<!doctype html>
<html lang="">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="utf-8" />
<link rel="shortcut icon" href="/favicon.ico" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta
  name="description"
  content="Follow along with OneGraph as we take over the world with GraphQL."
/>
<link rel="manifest" href="/manifest.json" />

<title>OneGraph Product Updates</title>
${styleTags ? styleTags : ""}
<meta name="viewport" content="width=device-width, initial-scale=1">
${
  assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ""
}
${
  process.env.NODE_ENV === "production"
    ? `<script src="${assets.client.js}" defer></script>`
    : `<script src="${assets.client.js}" defer crossorigin></script>`
}
</head>
<body>
<div id="root">${markup ? markup : ""}</div>
${bootstrapScript ? bootstrapScript : ""}
</body>
</html>`;
}

const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    try {
      res.set("Cache-Control", "public, max-age=300, s-maxage=300");
      const recordSource = new RecordSource();
      const cache = new RelayQueryResponseCache({
        size: 250,
        ttl: 1000 * 60 * 10
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
            routeConfig.getVariables(match)
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
          </StaticRouter>
        )
      );
      const styleTags = sheet.getStyleTags();
      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(
          buildHtml({
            markup,
            styleTags,
            bootstrapData: recordSource.toJSON()
          })
        );
      }
    } catch (e) {
      console.error(e);
      res
        .status(200)
        .send(
          buildHtml({ markup: null, styleTags: null, bootstrapData: null })
        );
    }
  });

export default server;
