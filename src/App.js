// @flow

import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import {QueryRenderer, fetchQuery} from 'react-relay';
import Posts from './Posts';
import Post from './Post';
import Comments from './Comments';
import {onegraphAuth, defaultCache} from './Environment';
import {Router, Location} from '@reach/router';
import Link from './PreloadLink';
import {NotificationContainer} from './Notifications';
import OneGraphLogo from './oneGraphLogo';
import {Grommet} from 'grommet/components/Grommet';
import {Grid} from 'grommet/components/Grid';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Header} from 'grommet/components/Header';
import {Text} from 'grommet/components/Text';
import {Anchor} from 'grommet/components/Anchor';
import {ResponsiveContext} from 'grommet/contexts/ResponsiveContext';
import {generate} from 'grommet/themes/base';
import {deepMerge} from 'grommet/utils/object';
import {StatusCritical} from 'grommet-icons/icons/StatusCritical';
import UserContext from './UserContext';
import {Helmet} from 'react-helmet';
import {ScrollContext} from 'gatsby-react-router-scroll';
import Avatar from './Avatar';
import config from './config';

import type {Viewer} from './UserContext';
import type {App_QueryResponse} from './__generated__/App_Query.graphql';
import type {
  App_PermissionsQueryResponse,
  GitHubRepositoryPermission,
} from './__generated__/App_PermissionsQuery.graphql';
import type {App_PostQueryResponse} from './__generated__/App_PostQuery.graphql';
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

const permissionsQuery = graphql`
  query App_PermissionsQuery($repoName: String!, $repoOwner: String!)
    @persistedQueryConfiguration(
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    ) {
    gitHub {
      viewer {
        login
        avatarUrl(size: 96)
      }
      repository(name: $repoName, owner: $repoOwner) {
        viewerPermission
        viewerCanAdminister
      }
    }
  }
`;

const postsRootQuery = graphql`
  # repoName and repoOwner provided by fixedVariables
  query App_Query($repoName: String!, $repoOwner: String!)
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      cacheSeconds: 300
    ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        ...Posts_repository
      }
    }
  }
`;

const ErrorBox = ({error}: {error: any}) => {
  const relayError = error?.source?.errors?.[0]?.message;
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
  props: ?App_QueryResponse,
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
  query App_PostQuery(
    $issueNumber: Int!
    $repoName: String!
    $repoOwner: String!
  )
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      freeVariables: ["issueNumber"]
      cacheSeconds: 300
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

// TODO: Handle missing post
const PostRoot = ({
  error,
  props,
}: {
  error: ?Error,
  props: ?App_PostQueryResponse,
}) => {
  if (error) {
    return <ErrorBox error={error} />;
  }
  if (!props) {
    return null;
  }
  const post = props.gitHub?.repository?.issue;
  const labels = post?.labels?.nodes;
  if (
    !post ||
    !labels ||
    !labels.find(l => l && l.name.toLowerCase() === 'publish')
  ) {
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

const RenderRoute = ({routeConfig, environment, ...props}) => (
  <QueryRenderer
    dataFrom="STORE_THEN_NETWORK"
    fetchPolicy="store-and-network"
    environment={environment}
    query={routeConfig.query}
    variables={routeConfig.getVariables(props)}
    render={routeConfig.component}
  />
);

const Route = ({path, routeConfig, environment, Component, ...props}) => {
  return (
    <div>
      <Header
        background="brand"
        direction="row"
        align="center"
        justify="center"
        pad="small"
        elevation="small">
        <Box
          direction="row"
          pad={{horizontal: 'medium'}}
          flex="grow"
          justify="between"
          wrap
          style={{maxWidth: 1080}}>
          <Box width="32px" />
          <Box wrap align="center">
            <Heading
              style={{marginTop: 0, marginBottom: 0, textAlign: 'center'}}
              level={2}>
              <Link
                getProps={({isCurrent}) => ({
                  style: isCurrent
                    ? {
                        textDecoration: 'none',
                        color: 'inherit',
                        cursor: 'auto',
                      }
                    : {color: 'inherit'},
                })}
                to="/">
                {config.title || 'OneBlog'}
              </Link>
            </Heading>
          </Box>
          <Box width="32px">
            <Avatar />
          </Box>
        </Box>
      </Header>
      <div className="layout">
        <Box>
          <Component
            routeConfig={routeConfig}
            environment={environment}
            {...props}
          />
        </Box>
      </div>
    </div>
  );
};

export const routes = [
  {
    path: '/',
    exact: true,
    strict: false,
    query: postsRootQuery,
    getVariables: (props: any) => ({}),
    component: PostsRoot,
  },
  {
    path: '/post/:issueNumber/:slug?',
    exact: true,
    strict: false,
    query: postRootQuery,
    getVariables: (props: any) => ({
      issueNumber: parseInt(props.issueNumber, 10),
    }),
    component: PostRoot,
  },
];

function shouldUpdateScroll(prevRouterProps, {location}) {
  const {pathname, hash} = location;

  if (prevRouterProps) {
    const {
      location: {pathname: oldPathname},
    } = prevRouterProps;
    if (oldPathname === pathname) {
      // Scroll to element if it exists, if it doesn't, or no hash is provided,
      // scroll to top.
      return hash ? decodeURI(hash.slice(1)) : [0, 0];
    }
  }
  return true;
}

function ScrollContextWrapper({location, children}) {
  if (typeof window === 'undefined') {
    return children;
  }
  return (
    <ScrollContext location={location} shouldUpdateScroll={shouldUpdateScroll}>
      {children}
    </ScrollContext>
  );
}

const MANAGE_LABEL_ROLES: Array<GitHubRepositoryPermission> = [
  'ADMIN',
  'MAINTAIN',
  'WRITE',
  'TRIAGE',
];

export default class App extends React.PureComponent<
  {environment: Environment, basepath: string},
  {isLoggedIn: boolean, viewer: ?Viewer},
> {
  state = {
    isLoggedIn: false,
    viewer: null,
  };
  componentDidMount() {
    onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
      this.setState({isLoggedIn});
      this._setViewer();
    });
  }
  _setViewer = async () => {
    if (!this.state.isLoggedIn) {
      this.setState({viewer: null});
    } else {
      try {
        const res: App_PermissionsQueryResponse = await fetchQuery(
          this.props.environment,
          permissionsQuery,
          {},
        );
        const viewerIsAdmin = res.gitHub?.repository?.viewerCanAdminister;
        const viewerPermission = res.gitHub?.repository?.viewerPermission;
        const viewer = res.gitHub?.viewer;
        if (!viewer) {
          this.setState({viewer: null});
        } else {
          this.setState({
            viewer: {
              ...viewer,
              isAdmin:
                viewerIsAdmin || MANAGE_LABEL_ROLES.includes(viewerPermission),
            },
          });
        }
      } catch (e) {
        console.error('error getting viewer', e);
        this.setState({viewer: null});
      }
    }
  };
  _login = () => {
    onegraphAuth.login('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        defaultCache.clear();
        this.setState({isLoggedIn});
        this._setViewer();
      }),
    );
  };
  _logout = () => {
    onegraphAuth.logout('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        defaultCache.clear();
        onegraphAuth.destroy();
        this.setState({isLoggedIn});
        this._setViewer();
      }),
    );
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          viewer: this.state.viewer,
          login: this._login,
          logout: this._logout,
        }}>
        <Helmet
          defaultTitle={config.title}
          titleTemplate={'%s' + (config.title ? ' - ' + config.title : '')}>
          {config.description ? (
            <meta name="description" content={config.description} />
          ) : null}
          <meta charSet="utf-8" />
        </Helmet>
        <NotificationContainer>
          <Grommet theme={theme}>
            <Location>
              {({location}) => (
                <ScrollContextWrapper location={location}>
                  <Router primary={true} basepath={this.props.basepath}>
                    {routes.map((routeConfig, i) => (
                      <Route
                        key={`${
                          this.state.isLoggedIn ? 'logged-in' : 'logged-out'
                        }-${i}`}
                        path={routeConfig.path}
                        environment={this.props.environment}
                        routeConfig={routeConfig}
                        Component={RenderRoute}
                      />
                    ))}
                  </Router>
                </ScrollContextWrapper>
              )}
            </Location>
          </Grommet>
        </NotificationContainer>
      </UserContext.Provider>
    );
  }
}
