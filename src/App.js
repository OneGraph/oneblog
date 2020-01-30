// @flow

import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import stableCopy from 'relay-runtime/lib/util/stableCopy';
import {QueryRenderer, fetchQuery} from 'react-relay';
import {
  RelayEnvironmentProvider,
  usePreloadedQuery,
  useLazyLoadQuery,
  preloadQuery,
} from 'react-relay/hooks';
import Posts from './Posts';
import Post, {PostBox} from './Post';
import Comments from './Comments';
import {onegraphAuth} from './Environment';
import {Router, Location} from '@reach/router';
import Link from './PreloadLink';
import {NotificationContainer, NotificationContext} from './Notifications';
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
import UserContext from './UserContext';
import {Helmet} from 'react-helmet';
import {ScrollContext} from 'gatsby-react-router-scroll';
import Avatar from './Avatar';
import config from './config';
import {css} from 'styled-components';
import {editIssueUrl} from './issueUrls';
import {Github} from 'grommet-icons/icons/Github';
import PreloadCache from './preloadQueryCache';
import PreloadCacheContext from './PreloadCacheContext';

import type {LoginStatus} from './UserContext';
import type {
  App_QueryResponse,
  App_Query,
} from './__generated__/App_Query.graphql';
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
  anchor: {
    fontWeight: 'normal',
    textDecoration: 'underline',
    color: null,
  },
  button: {
    border: {
      radius: 4,
    },
    extend(props) {
      return props.plain
        ? null
        : css`
            &:hover {
              box-shadow: none;
              color: ${props.theme.global.colors.brand};
            }
          `;
    },
  },
});

function Header({gitHub, adminLinks}) {
  return (
    <>
      <Box margin="medium" style={{position: 'absolute', top: 0, right: 0}}>
        <Avatar gitHub={gitHub} adminLinks={adminLinks} />
      </Box>
      <PostBox>
        <Box
          pad={{horizontal: 'medium'}}
          border={{
            size: 'xsmall',
            side: 'bottom',
            color: 'rgba(0,0,0,0.1)',
          }}>
          <Heading style={{marginTop: 0}} level={1}>
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
      </PostBox>
    </>
  );
}

const postsRootQuery = graphql`
  # repoName and repoOwner provided by fixedVariables
  query App_Query($repoName: String!, $repoOwner: String!)
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      cacheSeconds: 300
    ) {
    gitHub {
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        ...Posts_repository
      }
    }
  }
`;

const ErrorBox = ({error}: {error: any}) => {
  const relayError = error?.source?.errors?.[0]?.message;
  return (
    <Box
      margin={{vertical: 'large'}}
      gap="xsmall"
      justify="center"
      align="center"
      direction="row">
      <StatusCritical color="status-error" />{' '}
      <Text size="medium">
        {relayError || error.message}
        {error.type === 'missing-cors' ? (
          <div>
            {' '}
            Allow the current URL in the CORS Origins form on the{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://www.onegraph.com/dashboard/app/${config.appId}`}>
              OneGraph Dashboard
            </a>
            .
          </div>
        ) : null}
      </Text>
    </Box>
  );
};

class ErrorBoundary extends React.Component<{children: *}, {error: ?Error}> {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  render() {
    if (this.state.error != null) {
      return <ErrorBox error={this.state.error} />;
    }
    return this.props.children;
  }
}

function PostsRoot({preloadedQuery}: {preloadedQuery: any}) {
  const data: App_QueryResponse = usePreloadedQuery<App_QueryResponse>(
    postsRootQuery,
    preloadedQuery,
  );
  const respository = data?.gitHub ? data?.gitHub.repository : null;
  if (!respository || !data.gitHub) {
    return <ErrorBox error={new Error('Repository not found.')} />;
  } else {
    return (
      <>
        <Header gitHub={data.gitHub} adminLinks={[]} />
        <Posts repository={respository} />
      </>
    );
  }
}

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
      viewer {
        login
        name
        avatarUrl(size: 96)
        url
      }
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        issue(number: $issueNumber) {
          labels(first: 100) {
            nodes {
              name
            }
          }
          title
          id
          number
          ...Post_post
          ...Comments_post
        }
      }
    }
  }
`;

function PostRoot({preloadedQuery}: {preloadedQuery: any}) {
  const data: App_PostQueryResponse = usePreloadedQuery<App_PostQueryResponse>(
    postRootQuery,
    preloadedQuery,
  );

  const post = data?.gitHub?.repository?.issue;
  const labels = post?.labels?.nodes;
  if (
    !data ||
    !data.gitHub ||
    !post ||
    !labels ||
    !labels.find(l => l && l.name.toLowerCase() === 'publish')
  ) {
    return <ErrorBox error={new Error('Missing post.')} />;
  } else {
    return (
      <>
        <Helmet>
          <title>{post.title}</title>
        </Helmet>
        <Header
          gitHub={data.gitHub}
          adminLinks={[
            {
              label: 'Edit post',
              href: editIssueUrl({issueNumber: post.number}),
              icon: <Github size="16px" />,
            },
          ]}
        />
        <Post context="details" post={post} />
        <Comments post={post} postId={post.id} viewer={data?.gitHub?.viewer} />
      </>
    );
  }
}

const Route = React.memo(function Route({
  cache,
  routeConfig,
  environment,
  ...props
}) {
  const notificationContext = React.useContext(NotificationContext);
  const {loginStatus} = React.useContext(UserContext);
  return (
    <div style={{position: 'relative'}}>
      <div className="layout">
        <ErrorBoundary>
          <React.Suspense fallback={null}>
            <routeConfig.component
              key={loginStatus === 'logged-in' ? 'logged-in' : 'logged-out'}
              preloadedQuery={routeConfig.preload(cache, environment, {
                ...props,
                notificationContext,
              })}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
});

function makeRoute({path, query, getVariables, component}) {
  return {
    path,
    query,
    getVariables,
    component,
    preload(cache: PreloadCache, environment: Environment, props: any) {
      const preloadedQuery = cache.get(
        environment,
        query,
        getVariables(props),
        {
          fetchPolicy: 'store-and-network',
        },
      );
      if (props.notificationContext) {
        try {
          preloadedQuery.source.subscribe({
            complete: () => {
              props.notificationContext.clearCorsViolation();
            },
            error: e => {
              if (e.type === 'missing-cors') {
                props.notificationContext.setCorsViolation();
              }
            },
          });
        } catch (e) {
          console.error('error in cors check', e);
        }
      }
      return preloadedQuery;
    },
  };
}

const postsRoute = makeRoute({
  path: '/',
  query: postsRootQuery,
  getVariables(props: any) {
    return {};
  },
  component: PostsRoot,
});

export const postRoute = makeRoute({
  path: '/post/:issueNumber/:slug?',
  query: postRootQuery,
  getVariables(props: any) {
    return {
      issueNumber: parseInt(props.issueNumber, 10),
    };
  },
  component: PostRoot,
});

const postRouteNoSlug = {...postRoute, path: '/post/:issueNumber'};

export const routes = [postsRoute, postRoute, postRouteNoSlug];

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

export default function App({
  environment,
  basepath,
}: {
  environment: Environment,
  basepath: string,
}) {
  const [loginStatus, setLoginStatus] = React.useReducer(
    (_state, newState) => newState,
    'checking',
  );

  const cache = React.useContext(PreloadCacheContext);

  React.useEffect(() => {
    onegraphAuth
      .isLoggedIn('github')
      .then(isLoggedIn => {
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      })
      .catch(e => {
        console.error('Error checking login status', e);
        setLoginStatus('error');
      });
  }, []);

  const login = () => {
    onegraphAuth.login('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        cache.clear(environment);
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      }),
    );
  };
  const logout = () => {
    onegraphAuth.logout('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        cache.clear(environment);
        onegraphAuth.destroy();
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      }),
    );
  };

  return (
    <RelayEnvironmentProvider environment={environment}>
      <UserContext.Provider
        value={{
          loginStatus,
          login,
          logout,
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
                  <Router primary={true} basepath={basepath}>
                    {routes.map((routeConfig, i) => (
                      <Route
                        key={i}
                        path={routeConfig.path}
                        environment={environment}
                        cache={cache}
                        routeConfig={routeConfig}
                      />
                    ))}
                  </Router>
                </ScrollContextWrapper>
              )}
            </Location>
          </Grommet>
        </NotificationContainer>
      </UserContext.Provider>
    </RelayEnvironmentProvider>
  );
}
