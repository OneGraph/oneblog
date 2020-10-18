// @flow

import React from 'react';
import {Box, Heading, Text, Avatar, Paragraph} from 'grommet';
import {useLazyLoadQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import {postPath} from './Post';
import {newIssueUrl} from './issueUrls';

import type {
  LandingQuery,
  LandingQueryResponse,
} from './__generated__/LandingQuery.graphql';

// XXX: Add a label, e.g. Highlighted
const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query LandingQuery($repoName: String!, $repoOwner: String!)
  @persistedQueryConfiguration(
    accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["author"]
    cacheSeconds: 300
  ) {
    gitHub {
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        issues(
          filterBy: {labels: ["Publish"]}
          orderBy: {field: CREATED_AT, direction: DESC}
          first: 100
        ) {
          nodes {
            number
            title
            author {
              login
              ... on GitHubUser {
                name
              }
              avatarUrl(size: 96)
            }
          }
        }
      }
    }
  }
`;

const P = (props) => <Paragraph fill={true} {...props} />;

function LatestPosts({data}: {data: LandingQueryResponse}) {
  const posts: Array<{|
    +author: {|
      +avatarUrl: any,
      +login: string,
      +name?: ?string,
    |},
    +number: number,
    +title: string,
  |}> = [];
  const nodes = data.gitHub?.repository?.issues?.nodes;
  if (nodes) {
    for (const issue of nodes) {
      if (issue) {
        const author = issue.author;
        if (author) {
          // Satisfy flow
          posts.push({...issue, author});
        }
      }
    }
  }
  return posts.map((post) => (
    <Box
      direction="row"
      gap="small"
      key={post.number}
      margin={{bottom: 'medium'}}>
      <Box flex={{shrink: 0}}>
        <Avatar src={post.author.avatarUrl} />{' '}
      </Box>
      <Box>
        <a href={`https://${post.author.login}.essay.dev${postPath({post})}`}>
          {post.title}
        </a>
        <Text size="small">{post.author?.name || post.author?.login}</Text>
      </Box>
    </Box>
  ));
}

export default function Landing() {
  const data: ?LandingQueryResponse = useLazyLoadQuery<LandingQuery>(
    query,
    // $FlowFixMe: expects variables that were persisted
    {},
    {fetchPolicy: 'store-and-network'},
  );
  return (
    <Box pad={{horizontal: 'medium'}}>
      <Box>
        <Heading level={2}>Essay.dev</Heading>
      </Box>

      <Text>
        <P>
          Essay.dev is a blogging service by{' '}
          <a href="https://onegraph.com">OneGraph</a> that lets you create a
          blog by posting an issue to GitHub.
        </P>
        <P>
          <a href={newIssueUrl()} rel="noopener noreferrer" target="_blank">
            Create an issue on OneGraph/essay.dev
          </a>{' '}
          and your issue will become a blog post at
          your-github-username.essay.dev.
        </P>
      </Text>
      <Box>
        <Heading level={3}>Recent articles</Heading>
        {data ? <LatestPosts data={data} /> : null}
      </Box>
    </Box>
  );
}
