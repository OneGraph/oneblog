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
  query PostsRoot_Query(
    $repoName: String!
    $repoOwner: String!
    $author: String!
  )
  @persistedQueryConfiguration(
    accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["author"]
    cacheSeconds: 300
  ) {
    gitHub {
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        ...Posts_repository @arguments(author: $author)
      }
      user(login: $author) {
        name
        login
      }
    }
  }
`;

export const PostsRoot = ({subdomain}: {subdomain: string}) => {
  const data: ?PostsRoot_QueryResponse = useLazyLoadQuery<PostsRoot_Query>(
    query,
    // $FlowFixMe: expects variables that were persisted
    {author: subdomain},
    {fetchPolicy: 'store-and-network'},
  );

  if (!data) {
    return null;
  }
  const repository = data?.gitHub ? data?.gitHub.repository : null;
  if (!repository || !data.gitHub) {
    return <ErrorBox error={new Error('Repository not found.')} />;
  } else {
    const title =
      data.gitHub.user?.name || data.gitHub.user?.login || subdomain;
    return (
      <>
        <Header title={title} gitHub={data.gitHub} adminLinks={[]} />
        <Posts repository={repository} />
      </>
    );
  }
};
