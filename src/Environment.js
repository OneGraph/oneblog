// @flow

import React from 'react';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import config from './config';

import OneGraphAuth from 'onegraph-auth';

import type {RecordMap} from 'relay-runtime/store/RelayStoreTypes';

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

export const onegraphAuth =
  typeof window !== 'undefined'
    ? new OneGraphAuth({
        appId: config.appId,
      })
    : new AuthDummy();

async function sendRequest({onegraphAuth, requestBody}) {
  const response = await fetch(
    'https://serve.onegraph.com/graphql?app_id=' + config.appId,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...onegraphAuth.authHeaders(),
      },
      body: requestBody,
    },
  );
  return await response.json();
}

async function checkifCorsRequired(): Promise<boolean> {
  try {
    const response = await fetch(
      'https://serve.onegraph.com/is-cors-origin-allowed?app_id=' +
        config.appId,
    );
    const json = await response.json();
    return !json.allowed;
  } catch (e) {
    console.error('Error checking if CORS required');
    return false;
  }
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

type FetchQueryOpts = {onCorsError?: ?() => void};

function createFetchQuery(opts: ?FetchQueryOpts) {
  return async function fetchQuery(operation, rawVariables, cacheConfig) {
    const variables = {};
    // Bit of a hack to prevent Relay from sending null values for variables
    // we provided to OneGraph via fixedVariables.
    for (const k of Object.keys(rawVariables)) {
      if (rawVariables[k] != null) {
        variables[k] = rawVariables[k];
      }
    }

    const requestBody = JSON.stringify({
      doc_id: operation.id,
      query: operation.text,
      variables,
    });

    try {
      const json = await sendRequest({
        onegraphAuth,
        requestBody,
      });

      if (json.errors && Object.keys(onegraphAuth.authHeaders()).length) {
        // Clear auth on any error and try again
        onegraphAuth.destroy();
        const newJson = await sendRequest({
          onegraphAuth,
          headers: {},
          requestBody,
        });
        return maybeNullOutQuery(newJson);
      } else {
        return maybeNullOutQuery(json);
      }
    } catch (e) {
      if (typeof window !== 'undefined') {
        const isCorsRequired = await checkifCorsRequired();
        if (isCorsRequired) {
          const error = new Error('Missing CORS origin.');
          (error: any).type = 'missing-cors';
          if (opts?.onCorsError) {
            opts.onCorsError();
          }
          throw error;
        }
      }
      throw e;
    }
  };
}

export function createEnvironment(opts?: ?FetchQueryOpts) {
  const recordSource = new RecordSource();
  const store = new Store(recordSource);
  store.holdGC();
  return new Environment({
    network: Network.create(createFetchQuery(opts)),
    store,
  });
}

let globalEnvironment;

export function initEnvironment(
  initialRecords: ?RecordMap,
  opts?: ?FetchQueryOpts,
) {
  const environment = globalEnvironment ?? createEnvironment(opts);
  if (
    initialRecords &&
    environment
      .getStore()
      .getSource()
      .getRecordIDs().length <= 1
  ) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }

  if (typeof window !== 'undefined') {
    globalEnvironment = environment;
  }

  return environment;
}

export function useEnvironment(
  initialRecords: ?RecordMap,
  opts?: ?FetchQueryOpts,
) {
  const store = React.useRef(initEnvironment(initialRecords, opts));
  return store.current;
}
