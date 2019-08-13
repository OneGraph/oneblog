// @flow

import React from "react";
import "./App.css";
import graphql from "babel-plugin-relay/macro";
import { QueryRenderer } from "react-relay";
import Posts from "./Posts";
import type { App_ViewerQueryResponse } from "./__generated__/App_Query.graphql";

import { environment, onegraphAuth } from "./Environment";

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
      <QueryRenderer
        environment={environment}
        query={graphql`
          query App_Query
            @persistedQueryConfiguration(
              accessToken: { environmentVariable: "OG_GITHUB_TOKEN" }
            ) {
            gitHub {
              repository(name: "changelog-blog", owner: "dwwoelfel") {
                ...Posts_repository
              }
            }
          }
        `}
        variables={{}}
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
            return null;
          }
          const respository = props.gitHub ? props.gitHub.repository : null;
          if (!respository) {
            return <div>repository not found</div>;
          } else {
            return (
              <Posts
                repository={respository}
                isLoggedIn={this.state.isLoggedIn}
                login={this._login}
                logout={this._logout}
              />
            );
          }
        }}
      />
    );
  }
}
