// @flow

import React from 'react';
import {fetchQuery} from 'react-relay';
import {query, PostsRoot} from '../PostsRoot';
import {createEnvironment} from '../Environment';

export async function getStaticProps() {
  const environment = createEnvironment();
  await fetchQuery(environment, query, {});
  return {
    revalidate: 600,
    props: {
      initialRecords: environment
        .getStore()
        .getSource()
        .toJSON(),
    },
  };
}

const Index = () => {
  return <PostsRoot />;
};

export default Index;
