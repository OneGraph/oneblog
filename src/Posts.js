// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {createPaginationContainer, type RelayPaginationProp} from 'react-relay';
import Post from './Post';
import type {Posts_repository} from './__generated__/Posts_repository.graphql';
import LoadingSpinner from './loadingSpinner';
import {Box} from 'grommet/components/Box';
import {useInView} from 'react-intersection-observer';
import Welcome from './Welcome';
import config from './config';
import 'intersection-observer';

type Props = {|
  relay: RelayPaginationProp,
  repository: Posts_repository,
|};

// TODO: pagination. Can do pages or infinite scroll
const Posts = ({relay, repository}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [inViewRef, inView] = useInView({threshold: 0});

  React.useEffect(() => {
    if (inView && !isLoading && !relay.isLoading() && relay.hasMore()) {
      setIsLoading(true);
      relay.loadMore(10, (x) => {
        setIsLoading(false);
      });
    }
  }, [relay, isLoading, setIsLoading, inView]);

  const issues = [];
  for (const edge of repository.issues.edges || []) {
    if (edge && edge.node) {
      issues.push(edge.node);
    }
  }

  const isClientFetched = repository.issues.isClientFetched;

  if (
    issues.length === 0 &&
    // Take extra care to only show this if there really are no posts
    isClientFetched
  ) {
    return <Welcome key="welcome" />;
  }

  return (
    <Box key="content">
      {issues.map((node, i) => (
        <div
          ref={!isLoading && i === issues.length - 1 ? inViewRef : null}
          key={node.id}>
          <Post context="list" post={node} />
        </div>
      ))}
      {isLoading ? (
        <Box
          align="center"
          margin="medium"
          style={{
            maxWidth: 704,
          }}>
          <LoadingSpinner width="48px" height="48px" />
        </Box>
      ) : null}
    </Box>
  );
};

export default createPaginationContainer(
  Posts,
  {
    repository: graphql`
      fragment Posts_repository on GitHubRepository
      @argumentDefinitions(
        count: {type: "Int", defaultValue: 10}
        cursor: {type: "String"}
        orderBy: {
          type: "GitHubIssueOrder"
          defaultValue: {direction: DESC, field: CREATED_AT}
        }
      ) {
        issues(
          first: $count
          after: $cursor
          orderBy: $orderBy
          labels: ["publish", "Publish"]
        ) @connection(key: "Posts_posts_issues") {
          isClientFetched @__clientField(handle: "isClientFetched")
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.repository && props.repository.issues;
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count: count,
        cursor,
        orderBy: fragmentVariables.orderBy,
      };
    },

    query: graphql`
      # repoName and repoOwner provided by fixedVariables
      query PostsPaginationQuery(
        $count: Int!
        $cursor: String
        $orderBy: GitHubIssueOrder
        $repoOwner: String!
        $repoName: String!
      )
      @persistedQueryConfiguration(
        accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
        freeVariables: ["count", "cursor", "orderBy"]
        fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
        cacheSeconds: 300
      ) {
        gitHub {
          repository(name: $repoName, owner: $repoOwner) {
            __typename
            ...Posts_repository
              @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
          }
        }
      }
    `,
  },
);
