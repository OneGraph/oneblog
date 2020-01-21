// @flow

import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import RelayQueryResponseCache from './relayResponseCache';
import Cookies from 'universal-cookie';

import OneGraphAuth from 'onegraph-auth';

const ONEGRAPH_APP_ID = process.env.RAZZLE_ONEGRAPH_APP_ID;

if (!ONEGRAPH_APP_ID) {
  throw new Error('Must add RAZZLE_ONEGRAPH_APP_ID to .env');
}

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
      appId: ONEGRAPH_APP_ID,
      communicationMode: 'post_message',
      storage: new CookieStorage(),
    })
  : new AuthDummy();

function getQueryId(operation) {
  return operation.id || operation.text;
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

    const resp = fetch(
      'https://serve.onegraph.com/graphql?app_id=' + ONEGRAPH_APP_ID,
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
    ).then(response =>
      response.json().then(json => {
        // Clear full cache on mutation or if we get an error
        if (isMutation || !json.data || !json.data.gitHub) {
          cache.clear();
        }
        if (json.data.gitHub == null) {
          return {
            ...json,
            data: null,
          };
        }
        return json;
      }),
    );

    // TODO: clear auth on 401
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

const defaultCache = new RelayQueryResponseCache({
  size: 250,
  ttl: 1000 * 60 * 10,
});

export const environment = createEnvironment(recordSource, defaultCache);
