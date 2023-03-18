// @flow

import React from 'react';
import Header from './Header';
import {useLazyLoadQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import Posts from './Posts';
import ErrorBox from './ErrorBox';

import type {
  PostsRoot_Query,
  PostsRoot_QueryResponse,
} from './__generated__/PostsRoot_Query.graphql';

export const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query PostsRoot_Query($repoName: String!, $repoOwner: String!)
  @persistedQueryConfiguration(
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    cacheSeconds: 300
  ) {
    ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
    repository(name: $repoName, owner: $repoOwner) {
      ...Posts_repository
    }
  }
`;

export const PostsRoot = () => {
  const data: ?PostsRoot_QueryResponse = useLazyLoadQuery<PostsRoot_Query>(
    query,
    // $FlowFixMe: expects variables that were persisted
    {},
    {fetchPolicy: 'store-and-network'},
  );

  if (!data) {
    return null;
  }
  const repository = data ? data.repository : null;
  if (!repository) {
    return <ErrorBox error={new Error('Repository not found.')} />;
  } else {
    return (
      <>
        <Header adminLinks={[]} />
        <Posts repository={repository} />
      </>
    );
  }
};
