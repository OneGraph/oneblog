// @flow

import React from 'react';
import '../App.css';
import '../gifplayer.css';
import 'tippy.js/themes/light-border.css';

import {onegraphAuth, useEnvironment} from '../Environment';
import {RelayEnvironmentProvider, fetchQuery} from 'react-relay/hooks';
import UserContext from '../UserContext';
import {NotificationContainer, NotificationContext} from '../Notifications';
import {Grommet} from 'grommet/components/Grommet';
import theme from '../lib/theme';
import Head from '../Head';
import ErrorBoundary from '../ErrorBoundary';
import {useRouter} from 'next/router';
import {query as loginQuery} from '../LoginQuery';
import * as trk from '../lib/trk';
import {registerTokenInfo} from '../lib/codeHighlight';

function AppComponent({
  Component,
  pageProps,
  indexPageMemo,
  indexPageScrollPos,
  isIndexPage,
}: any) {
  React.useEffect(() => {
    if (isIndexPage && indexPageScrollPos.current) {
      window.scrollTo(0, indexPageScrollPos.current);
    }
  }, [isIndexPage, indexPageScrollPos]);

  let page;
  if (!isIndexPage || !indexPageMemo.current) {
    const res = (
      <ErrorBoundary>
        <React.Suspense fallback={null}>
          <Component {...pageProps} />
        </React.Suspense>
      </ErrorBoundary>
    );
    if (isIndexPage) {
      indexPageMemo.current = res;
    } else {
      page = res;
    }
  }

  // Keep the index page rendered so that we don't lose any posts we loaded
  return (
    <>
      <div style={{display: isIndexPage ? 'block' : 'none'}}>
        {indexPageMemo.current}
      </div>
      {page}
    </>
  );
}

function App({Component, pageProps}: any) {
  const router = useRouter();

  const indexPageMemo = React.useRef();
  // Stores scroll position of the index page for better back behavior
  // Ideally we would assign the scroll pos to the history item in the stack,
  // but that doesn't appear possible with next.js
  const indexPageScrollPos = React.useRef();

  const [loginStatus, setLoginStatus] = React.useReducer(
    (_state, newState) => newState,
    'checking',
  );

  const isIndexPage = router.pathname === '/';

  const handleRouteChangeStart = React.useCallback(
    (url) => {
      window.history.scrollRestoration = url === '/' ? 'manual' : 'auto';
      if (isIndexPage) {
        indexPageScrollPos.current = window.scrollY;
      }
      trk.pageview(url);
    },
    [isIndexPage, indexPageScrollPos],
  );

  React.useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [isIndexPage, router, handleRouteChangeStart]);

  const notificationContext = React.useContext(NotificationContext);

  const environment = useEnvironment(pageProps.initialRecords, {
    notificationContext,
  });

  if (pageProps.tokenInfos) {
    for (const code of Object.keys(pageProps.tokenInfos)) {
      registerTokenInfo({code, tokenInfo: pageProps.tokenInfos[code]});
    }
  }

  React.useEffect(() => {
    Promise.all([
      onegraphAuth.isLoggedIn('github'),
      fetchQuery(environment, loginQuery, {})
        .toPromise()
        .catch((e) => null),
    ])
      .then(([isLoggedIn]) => {
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      })
      .catch((e) => {
        console.error('Error checking login status', e);
        setLoginStatus('error');
      });
  }, [environment]);

  const login = () => {
    onegraphAuth.login('github').then(() =>
      Promise.all([
        onegraphAuth.isLoggedIn('github'),
        fetchQuery(environment, loginQuery, {})
          .toPromise()
          .catch((e) => null),
      ]).then(([isLoggedIn, x]) => {
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      }),
    );
  };
  const logout = () => {
    onegraphAuth.logout('github').then(() =>
      onegraphAuth.isLoggedIn('github').then((isLoggedIn) => {
        onegraphAuth.destroy();
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      }),
    );
  };

  return (
    <RelayEnvironmentProvider environment={environment}>
      <Head />
      <UserContext.Provider
        value={{
          loginStatus,
          login,
          logout,
        }}>
        <div style={{position: 'relative'}}>
          <div className="layout">
            <AppComponent
              Component={Component}
              pageProps={pageProps}
              indexPageMemo={indexPageMemo}
              indexPageScrollPos={indexPageScrollPos}
              isIndexPage={isIndexPage}
            />
          </div>
        </div>
      </UserContext.Provider>
    </RelayEnvironmentProvider>
  );
}

// n.b. this won't be triggered b/c we're using concurrent mode
// Open issue here: https://github.com/vercel/next.js/issues/17288
export function reportWebVitals({
  id,
  name,
  label,
  value,
}: {
  id: string,
  name: string,
  label: string,
  value: number,
}) {
  trk.event({
    action: name,
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers,
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

function AppWrapper({Component, pageProps}: any) {
  return (
    <Grommet theme={theme}>
      <NotificationContainer>
        <App Component={Component} pageProps={pageProps} />
      </NotificationContainer>
    </Grommet>
  );
}

export default AppWrapper;
