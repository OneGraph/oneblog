// @flow

import React from 'react';
import {fetchQuery} from 'react-relay/hooks';
import {query, PostsRoot} from '../PostsRoot';
import {createEnvironment} from '../Environment';
import {tokenInfosFromMarkdowns} from '../lib/codeHighlight';
import config from '../config';

export async function getStaticProps() {
  const markdowns = [];
  const environment = createEnvironment({
    registerMarkdown: function (m) {
      markdowns.push(m);
    },
  });
  await fetchQuery(environment, query, {}).toPromise();
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
    revalidate: 600,
    props: {
      initialRecords: environment.getStore().getSource().toJSON(),
      tokenInfos,
    },
  };
}

const Index = () => {
  return <PostsRoot />;
};

export default Index;
