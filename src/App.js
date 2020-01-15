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
import {Grommet} from 'grommet/components/Grommet';
import {Grid} from 'grommet/components/Grid';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Text} from 'grommet/components/Text';
import {Anchor} from 'grommet/components/Anchor';
import {ResponsiveContext} from 'grommet/contexts/ResponsiveContext';
import {generate} from 'grommet/themes/base';
import {deepMerge} from 'grommet/utils/object';
import {StatusCritical} from 'grommet-icons/icons/StatusCritical';
import {matchPath} from 'react-router-dom';
import UserContext from './UserContext';
import {Helmet} from 'react-helmet';

import type {App_ViewerQueryResponse} from './__generated__/App_Query.graphql';
import type {Environment} from 'relay-runtime';
import type {RelayNetworkError} from 'react-relay';

export const theme = deepMerge(generate(24, 10), {
  global: {
    colors: {
      brand: '#1997c6',
      'accent-1': '#3cc7b7',
      focus: 'rgba(60, 199, 183, 0.75)',
    },
    font: {
      family:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
  },
});

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
        <Post context="details" post={post} />
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
        <Helmet
          defaultTitle={process.env.RAZZLE_TITLE}
          titleTemplate={
            '%s' +
            (process.env.RAZZLE_TITLE ? ' - ' + process.env.RAZZLE_TITLE : '')
          }>
          {process.env.RAZZLE_DESCRIPTION ? (
            <meta name="description" content={process.env.RAZZLE_DESCRIPTION} />
          ) : null}
          <meta charSet="utf-8" />
        </Helmet>
        <NotificationContainer>
          <Grommet theme={theme}>
            <div className="layout">
              <Box
                gridArea="header"
                direction="row"
                align="center"
                justify="center"
                pad={{horizontal: 'medium', vertical: 'medium'}}
                wrap={true}>
                <Heading level={1}>
                  <Link style={{color: 'inherit'}} to="/">
                    OneBlog Test
                  </Link>
                </Heading>
              </Box>
              <Box gridArea="main">
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
            </div>
          </Grommet>
        </NotificationContainer>
      </UserContext.Provider>
    );
  }
}
