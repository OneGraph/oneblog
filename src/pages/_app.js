// @flow

import React from 'react';
import '../App.css';
import '../gifplayer.css';
import 'tippy.js/themes/light-border.css';

import {createEnvironment, onegraphAuth, useEnvironment} from '../Environment';
import {RelayEnvironmentProvider, useLazyLoadQuery} from 'react-relay/hooks';
import UserContext from '../UserContext';
import {NotificationContainer, NotificationContext} from '../Notifications';
import {Grommet} from 'grommet/components/Grommet';
import theme from '../lib/theme';
import Head from '../Head';
import ErrorBoundary from '../ErrorBoundary';

function App({Component, pageProps}: any) {
  const [loginStatus, setLoginStatus] = React.useReducer(
    (_state, newState) => newState,
    'checking',
  );

  const notificationContext = React.useContext(NotificationContext);

  const environment = useEnvironment(pageProps.initialRecords, {
    onCorsError: () => notificationContext.setCorsViolation(),
  });

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
        setLoginStatus(isLoggedIn ? 'logged-in' : 'logged-out');
      }),
    );
  };
  const logout = () => {
    onegraphAuth.logout('github').then(() =>
      onegraphAuth.isLoggedIn('github').then(isLoggedIn => {
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
            <ErrorBoundary>
              <React.Suspense fallback={null}>
                <Component
                  key={loginStatus === 'logged-in' ? 'logged-in' : 'logged-out'}
                  {...pageProps}
                />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </UserContext.Provider>
    </RelayEnvironmentProvider>
  );
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
