// @flow

import React from 'react';
import './App.css';
import graphql from 'babel-plugin-relay/macro';
import {QueryRenderer, fetchQuery} from 'react-relay';
import Posts from './Posts';
import Post, {PostBox} from './Post';
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

import type {LoginStatus} from './UserContext';
import type {App_QueryResponse} from './__generated__/App_Query.graphql';
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
    return (
      <>
        <Header gitHub={props.gitHub} adminLinks={[]} />
        <Posts repository={respository} />
      </>
    );
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
      <>
        <Helmet>
          <title>{post.title}</title>
        </Helmet>
        <Header
          gitHub={props.gitHub}
          adminLinks={[
            {
              label: 'Edit post',
              href: editIssueUrl({issueNumber: post.number}),
              icon: <Github size="16px" />,
            },
          ]}
        />
        <Post context="details" post={post} />
        <Comments post={post} postId={post.id} />
      </>
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
    <div className="layout">
      <Component
        routeConfig={routeConfig}
        environment={environment}
        {...props}
      />
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

export default class App extends React.PureComponent<
  {environment: Environment, basepath: string},
  {
    loginStatus: LoginStatus,
  },
> {
  state = {
    loginStatus: 'checking',
    viewer: null,
  };
  componentDidMount() {
    onegraphAuth
      .isLoggedIn('github')
      .then(isLoggedIn => {
        this.setState({loginStatus: isLoggedIn ? 'logged-in' : 'logged-out'});
      })
      .catch(e => {
        console.error('Error checking login status', e);
        this.setState({loginStatus: 'error'});
      });
  }

  _login = () => {
    onegraphAuth.login('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        defaultCache.clear();
        this.setState({loginStatus: isLoggedIn ? 'logged-in' : 'logged-out'});
      }),
    );
  };
  _logout = () => {
    onegraphAuth.logout('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
        defaultCache.clear();
        onegraphAuth.destroy();
        this.setState({loginStatus: isLoggedIn ? 'logged-in' : 'logged-out'});
      }),
    );
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          loginStatus: this.state.loginStatus,
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
                          this.state.loginStatus === 'logged-in'
                            ? 'logged-in'
                            : 'logged-out'
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
