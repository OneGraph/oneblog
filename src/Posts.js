// @flow

import React from "react";
import graphql from "babel-plugin-relay/macro";
import { createPaginationContainer, type RelayProp } from "react-relay";
import Post from "./Post";
import type { Posts_repository } from "./__generated__/Posts_repository.graphql";

type Props = {|
  relay: RelayProp,
  repository: Posts_repository,
  isLoggedIn: boolean,
  login: any,
  logout: any
|};

// TODO: pagination. Can do pages or infinite scroll
const Posts = ({ relay, repository, isLoggedIn, login, logout }: Props) => {
  return (
    <div style={{ margin: 64 }}>
      {(repository.issues.edges || []).map(e =>
        e && e.node ? (
          <Post
            key={e.node.id}
            post={e.node}
            isLoggedIn={isLoggedIn}
            login={login}
            logout={logout}
          />
        ) : null
      )}
    </div>
  );
};

export default createPaginationContainer(
  Posts,
  {
    repository: graphql`
      fragment Posts_repository on GitHubRepository
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          orderBy: {
            type: "GitHubIssueOrder"
            defaultValue: { direction: DESC, field: CREATED_AT }
          }
        ) {
        issues(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "Posts_posts_issues") {
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    `
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      // XXX How to get the refetch query to work?
      return props.repository && props.repository.issues;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count: count.pageSize,
        cursor,
        orderBy: fragmentVariables.orderBy
      };
    },

    query: graphql`
      query PostsPaginationQuery(
        $count: Int!
        $cursor: String
        $orderBy: GitHubIssueOrder
      ) {
        gitHub {
          repository(name: "changelog-blog", owner: "dwwoelfel") {
            ...Posts_repository
              @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
          }
        }
      }
    `
  }
);
