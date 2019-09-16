// @flow

import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import RelayQueryResponseCache from './relayResponseCache';

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

export const onegraphAuth = global.window
  ? new OneGraphAuth({
      appId: ONEGRAPH_APP_ID,
      communicationMode: 'post_message',
    })
  : new AuthDummy();

function getQueryId(operation) {
  return operation.id || operation.text;
}

function makeFetchQuery(cache) {
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
) {
  return new Environment({
    network: Network.create(makeFetchQuery(cache)),
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
