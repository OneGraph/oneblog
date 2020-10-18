// @flow

import React from 'react';
import {fetchQuery} from 'react-relay/hooks';
import {query, PostsRoot} from '../PostsRoot';
import {createEnvironment} from '../Environment';
import {tokenInfosFromMarkdowns} from '../lib/codeHighlight';
import config from '../config';
import {subdomainFromReq} from '../lib/subdomain';
import type {IncomingMessage} from 'http';
import Landing from '../Landing';

export async function getServerSideProps({req}: {req: IncomingMessage}) {
  const markdowns = [];
  const environment = createEnvironment({
    registerMarkdown: function (m) {
      markdowns.push(m);
    },
  });
  await fetchQuery(environment, query, {author: 'danieltest123'}).toPromise();
  let tokenInfos = {};

  try {
    tokenInfos = await tokenInfosFromMarkdowns({
      markdowns,
      theme: config.codeTheme,
    });
  } catch (e) {
    console.error('Error fetching tokenInfos for highlighting code', e);
  }

  return {
    props: {
      initialRecords: environment.getStore().getSource().toJSON(),
      tokenInfos,
      subdomain: subdomainFromReq(req),
    },
  };
}

const Index = ({subdomain}: {subdomain: ?string}) => {
  if (!subdomain) {
    return <Landing />;
  }

  return <PostsRoot subdomain={subdomain} />;
};

export default Index;
