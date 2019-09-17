// @flow

import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import {QueryRenderer, fetchQuery} from 'react-relay';
import Posts from './Posts';
import Post from './Post';
import Comments from './Comments';
import {onegraphAuth} from './Environment';
import {Route, Switch} from 'react-router-dom';
import Link from './PreloadLink';
import idx from 'idx';
import {NotificationContainer} from './Notifications';
import OneGraphLogo from './oneGraphLogo';
import {
  Grommet,
  Grid,
  Box,
  Heading,
  Text,
  Anchor,
  ResponsiveContext,
} from 'grommet';
import {StatusCritical} from 'grommet-icons';
import ScrollMemory from 'react-router-scroll-memory';
import {matchPath} from 'react-router-dom';
import UserContext from './UserContext';
import NewsletterSignup from './NewsletterSignup';

import type {App_ViewerQueryResponse} from './__generated__/App_Query.graphql';
import type {Environment} from 'relay-runtime';
import type {RelayNetworkError} from 'react-relay';

const theme = {
  name: 'onegraph',
  rounding: 4,
  spacing: 24,
  global: {
    colors: {
      brand: '#1997c6',
      'accent-1': '#3cc7b7',
      focus: 'rgba(60, 199, 183, 0.75)',
    },
    font: {
      family: 'Helvetica Neue,Helvetica,Arial,sans-serif',
      size: '14px',
      height: '20px',
    },
  },
  email: 'dwwoelfel@gmail.com',
  date: '2019-09-13T16:24:04.000Z',
};

const postsRootQuery = graphql`
  # repoName and repoOwner provided by fixedVariables
  query App_Query($repoName: String!, $repoOwner: String!)
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        ...Posts_repository
      }
    }
  }
`;

const ErrorBox = ({error}: {error: Error}) => {
  // $FlowFixMe
  const relayError = idx(error, _ => _.source.errors[0].message);
  return (
    <Box gap="xsmall" justify="center" align="center" direction="row">
      <StatusCritical color="status-error" />{' '}
      <Text size="medium">{relayError || error.message}</Text>
    </Box>
  );
};

const PostsRoot = ({
  error,
  props,
}: {
  error: ?Error,
  props: ?App_ViewerQueryResponse,
}) => {
  if (error) {
    return <ErrorBox error={error} />;
  }
  if (!props) {
    return null;
  }
  const respository = props.gitHub ? props.gitHub.repository : null;
  if (!respository) {
    return <ErrorBox error={new Error('Repository not found.')} />;
  } else {
    return <Posts repository={respository} />;
  }
};

export const postRootQuery = graphql`
  # repoName and repoOwner provided by fixedVariables
  query App_Post_Query(
    $issueNumber: Int!
    $repoName: String!
    $repoOwner: String!
  )
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      freeVariables: ["issueNumber"]
    ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        issue(number: $issueNumber) {
          labels(first: 100) {
            nodes {
              name
            }
          }
          id
          ...Post_post
          ...Comments_post
        }
      }
    }
  }
`;

const PostRoot = ({
  error,
  props,
}: {
  error: ?Error,
  props: ?App_ViewerQueryResponse,
}) => {
  if (error) {
    return <ErrorBox error={error} />;
  }
  if (!props) {
    return null;
  }
  const post = idx(props, _ => _.gitHub.repository.issue);
  const labels = idx(post, _ => _.labels.nodes) || [];
  if (!post || !labels.map(l => l.name.toLowerCase()).includes('publish')) {
    return <ErrorBox error={new Error('Missing post.')} />;
  } else {
    return (
      <Box>
        <Post post={post} />
        <Comments post={post} postId={post.id} />
      </Box>
    );
  }
};

const RenderRoute = ({routeConfig, environment, match}) => (
  <QueryRenderer
    dataFrom="STORE_THEN_NETWORK"
    fetchPolicy="store-and-network"
    environment={environment}
    query={routeConfig.query}
    variables={routeConfig.getVariables(match)}
    render={routeConfig.component}
  />
);

export const routes = [
  {
    path: '/',
    exact: true,
    strict: false,
    query: postsRootQuery,
    getVariables: (match: any) => ({}),
    component: PostsRoot,
  },
  {
    path: '/post/:issueNumber/:slug?',
    exact: true,
    strict: false,
    query: postRootQuery,
    getVariables: (match: any) => ({
      issueNumber: parseInt(match.params.issueNumber, 10),
    }),
    component: PostRoot,
  },
];

export default class App extends React.Component<
  {environment: Environment},
  {isLoggedIn: boolean},
> {
  state = {
    isLoggedIn: false,
  };
  componentDidMount() {
    onegraphAuth
      .isLoggedIn('github')
      .then(isLoggedIn => this.setState({isLoggedIn}));
  }
  _login = () => {
    onegraphAuth
      .login('github')
      .then(() =>
        onegraphAuth
          .isLoggedIn('github')
          .then(isLoggedIn => this.setState({isLoggedIn})),
      );
  };
  _logout = () => {
    onegraphAuth
      .logout('github')
      .then(() =>
        onegraphAuth
          .isLoggedIn('github')
          .then(isLoggedIn => this.setState({isLoggedIn})),
      );
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          login: this._login,
          logout: this._logout,
        }}>
        <NotificationContainer>
          <Grommet theme={theme}>
            <ResponsiveContext.Consumer>
              {size => {
                const small = size === 'small';
                return (
                  <Grid
                    fill
                    rows={['auto', 'flex']}
                    columns={small ? ['flex'] : ['flex', 'auto']}
                    areas={
                      small
                        ? [
                            {name: 'header', start: [0, 0], end: [1, 0]},
                            {name: 'main', start: [0, 1], end: [1, 1]},
                          ]
                        : [
                            {name: 'header', start: [0, 0], end: [1, 0]},
                            {name: 'main', start: [0, 1], end: [1, 1]},
                            {name: 'sidebar', start: [1, 1], end: [1, 1]},
                          ]
                    }>
                    <Box
                      gridArea="header"
                      direction="row"
                      align="center"
                      justify="between"
                      pad={{horizontal: 'medium', vertical: 'medium'}}
                      wrap={true}>
                      <Box align="center" direction="row">
                        <OneGraphLogo width="96px" height="96px" />{' '}
                        <Heading level={2}>
                          <Link style={{color: 'inherit'}} to="/">
                            OneGraph Product Updates
                          </Link>
                        </Heading>
                      </Box>
                      <Anchor href="https://onegraph.com">
                        <Text size="small">Learn more about OneGraph</Text>
                      </Anchor>
                    </Box>
                    {small ||
                    !process.env.RAZZLE_ENABLE_MAILCHIMP_SIGNUP ? null : (
                      <Box gridArea="sidebar" pad="medium" width="medium">
                        <NewsletterSignup />
                      </Box>
                    )}
                    <Box gridArea="main">
                      <ScrollMemory />
                      <Switch>
                        {routes.map((routeConfig, i) => (
                          <Route
                            key={i}
                            path={routeConfig.path}
                            exact={routeConfig.exact}
                            strict={routeConfig.strict}
                            render={props => (
                              <RenderRoute
                                environment={this.props.environment}
                                match={props.match}
                                routeConfig={routeConfig}
                              />
                            )}
                          />
                        ))}
                      </Switch>
                    </Box>
                  </Grid>
                );
              }}
            </ResponsiveContext.Consumer>
          </Grommet>
        </NotificationContainer>
      </UserContext.Provider>
    );
  }
}
