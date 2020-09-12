// @flow

import React from 'react';
import NextHead from 'next/head';
import config from './config';

function Head({title, imageUrl}: {title?: ?string, imageUrl?: ?string}) {
  const titleProp = title ? `${title} - ${config.title}` : config.title;
  return (
    <NextHead>
      <title>{titleProp}</title>
      {config.description ? (
        <meta name="description" content={config.description} />
      ) : null}
      <meta charSet="utf-8" />
      <meta property="og:title" content={titleProp} />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/feed.rss"
      />
      <link
        rel="alternate"
        href="/feed.atom"
        title="Atom feed"
        type="application/atom+xml"
      />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
    </NextHead>
  );
}

export default Head;
