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

export const onegraphAuth = new AuthDummy();

async function sendRequest({operation, variables}) {
  if (typeof window !== 'undefined') {
    const url = `/api/__generated__/${
      operation.id
    }?variables=${encodeURIComponent(JSON.stringify(stableCopy(variables)))}`;
    const response = await fetch(url);
    const json = await response.json();

    return json;
  } else {
    const {fetchQuery} = await import(
      `./pages/api/__generated__/${operation.id}.js`
    );
    return await fetchQuery(variables);
  }
}

type Opts = {
  notificationContext?: ?NotificationContextType,
  registerMarkdown?: (markdown: string) => void,
};

function createFetchQuery(opts: ?Opts) {
  return async function fetchQuery(operation, variables, cacheConfig) {
    const json = await sendRequest({
      operation,
      variables,
    });

    return json;
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
  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }

  if (typeof window !== 'undefined') {
    window._env = environment;
    globalEnvironment = environment;
  }

  return environment;
}

export function useEnvironment(initialRecords: ?RecordMap, opts?: ?Opts) {
  const store = React.useMemo(
    () => initEnvironment(initialRecords, opts),
    [initialRecords, opts],
  );

  return store;
}
