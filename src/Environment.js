// @flow

import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import Cookies from 'universal-cookie';
import config from './config';
import PreloadCache from './preloadQueryCache';

import OneGraphAuth from 'onegraph-auth';

class AuthDummy {
  isLoggedIn(x: any) {
    return Promise.resolve(false);
  }
  authHeaders() {
    return {};
  }
  login(x: any) {
    return Promise.resolve(null);
  }
  logout(x: any) {
    return Promise.resolve(null);
  }
  destroy() {
    return null;
  }
}

class CookieStorage {
  _cookies: Cookies = new Cookies();
  _getOptions = () => {
    return {
      path: '/',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    };
  };
  getItem = (key: string): ?string => {
    return this._cookies.get(key, {doNotParse: true});
  };
  setItem = (key: string, value: string): void => {
    this._cookies.set(key, value, this._getOptions());
  };
  removeItem = (key: string): void => {
    this._cookies.remove(key, this._getOptions());
  };
}

export const onegraphAuth = global.window
  ? new OneGraphAuth({
      appId: config.appId,
      communicationMode: 'post_message',
      storage: new CookieStorage(),
    })
  : new AuthDummy();

function getQueryId(operation) {
  return operation.id || operation.text;
}

async function sendRequest({appId, onegraphAuth, headers, requestBody}) {
  const response = await fetch(
    'https://serve.onegraph.com/graphql?app_id=' + config.appId,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...onegraphAuth.authHeaders(),
        // $FlowFixMe
        ...(headers ? headers : {}),
      },
      body: requestBody,
    },
  );
  return await response.json();
}

// Fix problem where relay gets nonnull `data` field and does weird things to the cache
function maybeNullOutQuery(json) {
  if (json.data && !json.data.gitHub) {
    return {
      ...json,
      data: null,
    };
  }
  return json;
}

function makeFetchQuery(
  headers?: ?{[key: string]: string},
  preloadCache: ?PreloadCache,
  getEnvironment,
) {
  return async function fetchQuery(operation, rawVariables, cacheConfig) {
    const variables = {};
    // Bit of a hack to prevent Relay from sending null values for variables
    // we provided to OneGraph via fixedVariables.
    for (const k of Object.keys(rawVariables)) {
      if (rawVariables[k] != null) {
        variables[k] = rawVariables[k];
      }
    }
    const queryId = getQueryId(operation);
    const forceFetch = cacheConfig && cacheConfig.force;
    const isMutation = operation.operationKind === 'mutation';
    const isQuery = operation.operationKind === 'query';

    const requestBody = JSON.stringify({
      doc_id: operation.id,
      query: operation.text,
      variables,
    });

    const appId = config.appId;

    const json = await sendRequest({
      appId,
      onegraphAuth,
      headers,
      requestBody,
    });

    if (isMutation && preloadCache) {
      getEnvironment();
      preloadCache.clear(getEnvironment());
    }

    if (
      json.errors &&
      (headers || Object.keys(onegraphAuth.authHeaders()).length)
    ) {
      // Clear auth on any error and try again
      onegraphAuth.destroy();
      const newJson = await sendRequest({
        appId,
        onegraphAuth,
        headers: {},
        requestBody,
      });
      return maybeNullOutQuery(newJson);
    } else {
      return maybeNullOutQuery(json);
    }
  };
}

export function createEnvironment(
  recordSource: RecordSource,
  headers?: ?{[key: string]: string},
  preloadCache: ?PreloadCache,
) {
  const store = new Store(recordSource);
  let environment;
  const getEnvironment = () => environment;
  environment = new Environment({
    network: Network.create(
      makeFetchQuery(headers, preloadCache, getEnvironment),
    ),
    store,
  });
  return environment;
}

export const recordSource =
  typeof window !== 'undefined' && window.__RELAY_BOOTSTRAP_DATA__
    ? new RecordSource(window.__RELAY_BOOTSTRAP_DATA__)
    : new RecordSource();
