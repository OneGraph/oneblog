// @flow

import React from 'react';
import {fetchQuery} from 'react-relay/hooks';
import {query, PostsRoot} from '../PostsRoot';
import {createEnvironment} from '../Environment';
import {tokenInfosFromMarkdowns} from '../lib/codeHighlight';
import {withOverrides} from '../config';
import {subdomainFromReq} from '../lib/subdomain';
import type {IncomingMessage, ServerResponse} from 'http';
import Landing, {query as landingQuery} from '../Landing';
import DefaultErrorPage from 'next/error';

export async function getServerSideProps({
  req,
  res,
}: {
  req: IncomingMessage,
  res: ServerResponse,
}) {
  const markdowns = [];
  const environment = createEnvironment({
    registerMarkdown: function (m) {
      markdowns.push(m);
    },
  });
  const subdomain = subdomainFromReq(req);
  if (!subdomain) {
    await fetchQuery(environment, landingQuery, {}).toPromise();

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return {
      props: {
        initialRecords: environment.getStore().getSource().toJSON(),
      },
    };
  }

  try {
    const result = await fetchQuery(environment, query, {
      subdomain: subdomain,
    }).toPromise();

    const author = result?.gitHub?.subdomainAuthor;

    let tokenInfos = {};

    try {
      const config = withOverrides({author, subdomain});
      tokenInfos = await tokenInfosFromMarkdowns({
        markdowns,
        theme: config.codeTheme,
      });
    } catch (e) {
      console.error('Error fetching tokenInfos for highlighting code', e);
    }

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

    return {
      props: {
        initialRecords: environment.getStore().getSource().toJSON(),
        tokenInfos,
        subdomain,
        author,
      },
    };
  } catch (e) {
    return {
      props: {
        is404: !!e.source?.errors?.[0]?.message?.match(/could not resolve/i),
        subdomain,
      },
    };
  }
}

const Index = ({subdomain, is404}: {subdomain: ?string, is404?: ?boolean}) => {
  if (is404) {
    return <DefaultErrorPage statusCode={404} />;
  }
  if (!subdomain) {
    return <Landing />;
  }

  return <PostsRoot subdomain={subdomain} />;
};

export default Index;
