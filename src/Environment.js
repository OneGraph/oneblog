// @flow

import React from 'react';
import {
  Environment,
  Network,
  RecordSource,
  Store,
  DefaultHandlerProvider,
  stableCopy,
} from 'relay-runtime';
import config from './config';

import OneGraphAuth from 'onegraph-auth';

import type {RecordMap, Handler} from 'relay-runtime/store/RelayStoreTypes';
import type {NotificationContextType} from './Notifications';

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

async function sendRequest({onegraphAuth, operation, variables}) {
  if (operation.operationKind === 'query' && operation.id) {
    const url = new URL('https://serve.onegraph.com/graphql');
    url.searchParams.set('app_id', config.appId);
    url.searchParams.set('doc_id', operation.id);
    url.searchParams.set('variables', JSON.stringify(stableCopy(variables)));
    if (config.persistedQueryCdnCacheBuster) {
      url.searchParams.set(
        'cdn_cache_bust',
        config.persistedQueryCdnCacheBuster,
      );
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        ...onegraphAuth.authHeaders(),
      },
    });
    return await response.json();
  } else {
    const requestBody = JSON.stringify({
      doc_id: operation.id,
      query: operation.text,
      variables,
    });

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
}

async function checkifCorsRequired(): Promise<boolean> {
  try {
    const response = await fetch(
      'https://serve.onegraph.com/is-cors-origin-allowed?app_id=' +
        config.appId,
    );
    const json = await response.json();
    // Default to false on any error
    return json.allowed === false;
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

type Opts = {
  notificationContext?: ?NotificationContextType,
  registerMarkdown?: (markdown: string) => void,
};

function createFetchQuery(opts: ?Opts) {
  return async function fetchQuery(operation, rawVariables, cacheConfig) {
    const variables = {};
    // Bit of a hack to prevent Relay from sending null values for variables
    // we provided to OneGraph via fixedVariables.
    for (const k of Object.keys(rawVariables)) {
      if (rawVariables[k] != null) {
        variables[k] = rawVariables[k];
      }
    }

    try {
      const json = await sendRequest({
        operation,
        variables,
        onegraphAuth,
      });

      // eslint-disable-next-line no-unused-expressions
      opts?.notificationContext?.clearCorsViolation();

      if (json.errors && Object.keys(onegraphAuth.authHeaders()).length) {
        // Clear auth on any error and try again
        onegraphAuth.destroy();
        const newJson = await sendRequest({
          onegraphAuth,
          headers: {},
          operation,
          variables,
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

          // eslint-disable-next-line no-unused-expressions
          opts?.notificationContext?.setCorsViolation();

          throw error;
        }
      }
      throw e;
    }
  };
}

const isClientFetchedHandler = {
  update(store, payload) {
    const record = store.get(payload.dataID);
    if (!record) {
      return;
    }
    record.setValue(typeof window !== 'undefined', payload.handleKey);
  },
};

function getRegisterMarkdownHandler(opts?: ?Opts) {
  return {
    update(store, payload) {
      const record = store.get(payload.dataID);
      if (!record) {
        return;
      }
      const value = record.getValue(payload.fieldKey, payload.args);
      if (value && typeof value === 'string' && opts?.registerMarkdown) {
        opts.registerMarkdown(value);
      }
      record.setValue(value, payload.handleKey);
    },
  };
}

function createHandlerProvider(opts?: ?Opts) {
  const registerMarkdownHandler = getRegisterMarkdownHandler(opts);
  return function handlerProvider(handle: string): Handler {
    switch (handle) {
      case 'isClientFetched':
        return isClientFetchedHandler;
      case 'registerMarkdown':
        return registerMarkdownHandler;
      default:
        return DefaultHandlerProvider(handle);
    }
  };
}

export function createEnvironment(opts?: ?Opts) {
  const recordSource = new RecordSource();
  const store = new Store(recordSource);
  store.holdGC();
  return new Environment({
    handlerProvider: createHandlerProvider(opts),
    network: Network.create(createFetchQuery(opts)),
    store,
  });
}

let globalEnvironment;

export function initEnvironment(initialRecords: ?RecordMap, opts?: ?Opts) {
  const environment = globalEnvironment ?? createEnvironment(opts);
  if (
    initialRecords &&
    environment.getStore().getSource().getRecordIDs().length <= 1
  ) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }

  if (typeof window !== 'undefined') {
    window._env = environment;
    globalEnvironment = environment;
  }

  return environment;
}

export function useEnvironment(initialRecords: ?RecordMap, opts?: ?Opts) {
  const store = React.useRef(initEnvironment(initialRecords, opts));
  return store.current;
}
