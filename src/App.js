// @flow

import React from "react";
import "./App.css";
import graphql from "babel-plugin-relay/macro";
import { QueryRenderer, fetchQuery } from "react-relay";
import Posts from "./Posts";
import Post, { LoadingPost } from "./Post";
import { environment, onegraphAuth } from "./Environment";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import idx from "idx.macro";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
// $FlowFixMe: https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files
import { ReactComponent as OneGraphLogo } from "./oneGraphLogo.svg";
import { Grommet, Grid, Box, Heading, Text, Anchor } from "grommet";
import ScrollMemory from "react-router-scroll-memory";

import type { App_ViewerQueryResponse } from "./__generated__/App_Query.graphql";

const theme = {
  global: {
    font: {
      family: "Helvetica,Arial,sans-serif",
      size: "14px",
      height: "20px"
    }
  }
};

const postsRootQuery = graphql`
  query App_Query
    @persistedQueryConfiguration(
      accessToken: { environmentVariable: "OG_GITHUB_TOKEN" }
    ) {
    gitHub {
      repository(name: "onegraph-changelog", owner: "onegraph") {
        ...Posts_repository
      }
    }
  }
`;

if (window.location.pathname === "/") {
  // Prep cache
  fetchQuery(environment, postsRootQuery, {});
}

const PostsRoot = ({
  isLoggedIn,
  login,
  logout
}: {
  isLoggedIn: boolean,
  login: any,
  logout: any
}) => {
  return (
    <QueryRenderer
      environment={environment}
      query={postsRootQuery}
      variables={{}}
      render={({
        error,
        props
      }: {
        error: ?Error,
        props: ?App_ViewerQueryResponse
      }) => {
        if (error) {
          // XXX: better errors
          return <div>Error!</div>;
        }
        if (!props) {
          return (
            <>
              <LoadingPost />
              <LoadingPost />
              <LoadingPost />
              <LoadingPost />
              <LoadingPost />
            </>
          );
        }
        const respository = props.gitHub ? props.gitHub.repository : null;
        if (!respository) {
          // XXX: better errors
          return <div>repository not found</div>;
        } else {
          return (
            <Posts
              repository={respository}
              isLoggedIn={isLoggedIn}
              login={login}
              logout={logout}
            />
          );
        }
      }}
    />
  );
};

export const postRootQuery = graphql`
  query App_Post_Query($issueNumber: Int!)
    @persistedQueryConfiguration(
      accessToken: { environmentVariable: "OG_GITHUB_TOKEN" }
    ) {
    gitHub {
      repository(name: "onegraph-changelog", owner: "onegraph") {
        issue(number: $issueNumber) {
          ...Post_post
        }
      }
    }
  }
`;

const PostRoot = ({
  isLoggedIn,
  login,
  logout,
  issueNumber
}: {
  isLoggedIn: boolean,
  login: any,
  logout: any,
  issueNumber: number
}) => {
  return (
    <QueryRenderer
      environment={environment}
      query={postRootQuery}
      variables={{ issueNumber: issueNumber }}
      render={({
        error,
        props
      }: {
        error: ?Error,
        props: ?App_ViewerQueryResponse
      }) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <LoadingPost />;
        }
        const post = idx(props, _ => _.gitHub.repository.issue);
        if (!post) {
          // XXX: better errors
          return <div>Post not found</div>;
        } else {
          return (
            <Post
              post={post}
              isLoggedIn={isLoggedIn}
              login={login}
              logout={logout}
            />
          );
        }
      }}
    />
  );
};

export default class App extends React.Component<*, { isLoggedIn: boolean }> {
  state = {
    isLoggedIn: false
  };
  componentDidMount() {
    onegraphAuth
      .isLoggedIn("github")
      .then(isLoggedIn => this.setState({ isLoggedIn }));
  }
  _login = () => {
    onegraphAuth
      .login("github")
      .then(() =>
        onegraphAuth
          .isLoggedIn("github")
          .then(isLoggedIn => this.setState({ isLoggedIn }))
      );
  };
  _logout = () => {
    onegraphAuth
      .logout("github")
      .then(() =>
        onegraphAuth
          .isLoggedIn("github")
          .then(isLoggedIn => this.setState({ isLoggedIn }))
      );
  };
  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <Grid
            fill
            rows={["auto", "flex"]}
            columns={["flex"]}
            areas={[
              { name: "header", start: [0, 0], end: [1, 0] },
              { name: "main", start: [0, 1], end: [1, 1] }
            ]}
          >
            <Box
              gridArea="header"
              direction="row"
              align="center"
              justify="between"
              pad={{ horizontal: "medium", vertical: "medium" }}
            >
              <Box align="center" direction="row">
                <OneGraphLogo width="96px" height="96px" />{" "}
                <Heading level={2}>
                  <Link style={{ color: "inherit" }} to="/">
                    OneGraph Product Updates
                  </Link>
                </Heading>
              </Box>
              <Anchor href="https://onegraph.com">
                <Text size="small">Learn more about OneGraph</Text>
              </Anchor>
            </Box>
            <Box gridArea="main">
              <ScrollMemory />
              <Route
                path="/"
                exact
                render={() => (
                  <PostsRoot
                    isLoggedIn={this.state.isLoggedIn}
                    login={this._login}
                    logout={this._logout}
                  />
                )}
              />
              <Route
                path="/post/:issueNumber"
                exact
                render={props => (
                  <PostRoot
                    isLoggedIn={this.state.isLoggedIn}
                    login={this._login}
                    logout={this._logout}
                    issueNumber={parseInt(props.match.params.issueNumber, 10)}
                  />
                )}
              />

              <NotificationContainer />
            </Box>
          </Grid>
        </Grommet>
      </Router>
    );
  }
}
