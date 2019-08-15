// @flow

import React from "react";
import graphql from "babel-plugin-relay/macro";
import { createPaginationContainer, type RelayProp } from "react-relay";
import Post from "./Post";
import type { Posts_repository } from "./__generated__/Posts_repository.graphql";
// $FlowFixMe: https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files
import { ReactComponent as LoadingSpinner } from "./loadingSpinner.svg";
import idx from "idx.macro";
import { Box } from "grommet";

type Props = {|
  relay: RelayProp,
  repository: Posts_repository,
  isLoggedIn: boolean,
  login: any,
  logout: any
|};

// TODO: pagination. Can do pages or infinite scroll
const Posts = ({ relay, repository, isLoggedIn, login, logout }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const scheduledRef = React.useRef(false);
  const handleScroll = React.useCallback(() => {
    if (!scheduledRef.current) {
      scheduledRef.current = true;
      window.requestAnimationFrame(() => {
        scheduledRef.current = false;
        if (
          window.innerHeight +
            idx(document, _ => _.documentElement.scrollTop) >=
          idx(document, _ => _.documentElement.offsetHeight) - 500
        ) {
          if (!isLoading && !relay.isLoading() && relay.hasMore()) {
            setIsLoading(true);
            console.log("setting isLoading to true");
            relay.loadMore(10, x => {
              console.log("setting isLoading to false", x);
              setIsLoading(false);
            });
          }
        }
      });
    }
  }, [relay, isLoading, setIsLoading]);
  React.useEffect(() => {
    console.log("adding new listener");
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("remove listener");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Box>
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
      {isLoading ? (
        <Box
          align="center"
          margin="medium"
          style={{
            maxWidth: 704
          }}
        >
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
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          orderBy: {
            type: "GitHubIssueOrder"
            defaultValue: { direction: DESC, field: CREATED_AT }
          }
        ) {
        issues(
          first: $count
          after: $cursor
          orderBy: $orderBy
          labels: ["publish"]
        ) @connection(key: "Posts_posts_issues") {
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
        count: count,
        cursor,
        orderBy: fragmentVariables.orderBy
      };
    },

    query: graphql`
      query PostsPaginationQuery(
        $count: Int!
        $cursor: String
        $orderBy: GitHubIssueOrder
      )
        @persistedQueryConfiguration(
          accessToken: { environmentVariable: "OG_GITHUB_TOKEN" }
        ) {
        gitHub {
          repository(name: "onegraph-changelog", owner: "onegraph") {
            __typename
            ...Posts_repository
              @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
          }
        }
      }
    `
  }
);
