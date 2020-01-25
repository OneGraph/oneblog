// @flow

import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import RelayQueryResponseCache from './relayResponseCache';
import Cookies from 'universal-cookie';
import config from './config';

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
  getItem = (key: string): ?string => {
    return this._cookies.get(key, {doNotParse: true});
  };
  setItem = (key: string, value: string): void => {
    const options = {
      path: '/',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    };
    this._cookies.set(key, value, options);
  };
  removeItem = (key: string): void => {
    this._cookies.remove(key);
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
        ...(headers ? headers : {}),
      },
      body: requestBody,
    },
  );
  return await response.json();
}

// Fix problem where relay gets nonnull `data` field and does weird things to the cache
function maybeNullOutQuery(json) {
  if (json.data && json.data.gitHub == null) {
    return {
      ...json,
      data: null,
    };
  }
  return json;
}

function makeFetchQuery(cache, headers?: ?{[key: string]: string}) {
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
    const fromCache = cache.get(queryId, variables);
    const isMutation = operation.operationKind === 'mutation';
    const isQuery = operation.operationKind === 'query';

    if (isQuery && fromCache !== null && !forceFetch) {
      return fromCache;
    }

    const requestBody = JSON.stringify({
      doc_id: operation.id,
      query: operation.text,
      variables,
    });

    const appId = config.appId;

    const resp = sendRequest({
      appId,
      onegraphAuth,
      headers,
      requestBody,
    }).then(async json => {
      // Clear full cache on mutation
      if (isMutation) {
        cache.clear();
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
    });

    if (isQuery) {
      cache.set(queryId, variables, resp);
    }
    return await resp;
  };
}

export function createEnvironment(
  recordSource: RecordSource,
  cache: RelayQueryResponseCache,
  headers?: ?{[key: string]: string},
) {
  return new Environment({
    network: Network.create(makeFetchQuery(cache, headers)),
    store: new Store(recordSource),
  });
}

const recordSource =
  typeof window !== 'undefined' && window.__RELAY_BOOTSTRAP_DATA__
    ? new RecordSource(window.__RELAY_BOOTSTRAP_DATA__)
    : new RecordSource();

export const defaultCache = new RelayQueryResponseCache({
  size: 250,
  ttl: 1000 * 60 * 10,
});

export const environment = createEnvironment(recordSource, defaultCache);
