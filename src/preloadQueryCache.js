// @flow

import stableCopy from 'relay-runtime/lib/util/stableCopy';
import {preloadQuery} from 'react-relay/hooks';

import type {Variables} from 'relay-runtime/lib/util/RelayRuntimeTypes';
import type {GraphQLResponse} from 'relay-runtime/lib/network/RelayNetworkTypes';
import type {Environment} from 'relay-runtime';

type Response = {
  fetchTime: number,
  payload: any,
};

type Responses = Map<string, Response>;

/**
 * A cache for storing query responses, featuring:
 * - `get` with TTL
 * - cache size limiting, with least-recently *updated* entries purged first
 */
export default class PreloadResponseCache {
  _responses: WeakMap<Environment, Responses>;
  _size: number;
  _ttl: number;

  constructor({size, ttl}: {size: number, ttl: number}) {
    this._responses = new WeakMap();
    this._size = Math.max(1, size);
    this._ttl = Math.max(1, ttl);
  }

  clear(environment: Environment): void {
    this.responsesForEnvironment(environment).clear();
  }

  responsesForEnvironment(environment: Environment) {
    const existingResponses = this._responses.get(environment);
    if (existingResponses) {
      return existingResponses;
    }
    const responses: Responses = new Map();
    this._responses.set(environment, responses);
    return responses;
  }

  get(
    environment: Environment,
    query: any,
    variables: Variables,
    config: any,
  ): any {
    const queryID = query.params.id;
    const cacheKey = getCacheKey(queryID, variables, config);
    const responses = this.responsesForEnvironment(environment);
    responses.forEach((response, key) => {
      if (!isCurrent(response.fetchTime, this._ttl)) {
        responses.delete(key);
      }
    });
    const response = responses.get(cacheKey);
    return response != null
      ? response.payload
      : this.set(environment, query, variables, config);
  }

  set(
    environment: Environment,
    query: any,
    variables: Variables,
    config: any,
  ): void {
    const fetchTime = Date.now();
    const queryID = query.params.id;
    const cacheKey = getCacheKey(queryID, variables, config);
    const responses = this.responsesForEnvironment(environment);
    responses.delete(cacheKey); // deletion resets key ordering
    const payload = preloadQuery(environment, query, variables, config);

    payload.source.subscribe({
      complete: () => {
        responses.set(cacheKey, {
          fetchTime,
          payload,
        });
        // Purge least-recently updated key when max size reached
        if (responses.size > this._size) {
          const firstKey = responses.keys().next();
          if (firstKey && firstKey.value) {
            responses.delete(firstKey.value);
          }
        }
      },
    });

    return payload;
  }
}

function getCacheKey(
  queryID: string,
  variables: Variables,
  config: any,
): string {
  return JSON.stringify(stableCopy({queryID, variables, config}));
}

/**
 * Determine whether a response fetched at `fetchTime` is still valid given
 * some `ttl`.
 */
function isCurrent(fetchTime: number, ttl: number): boolean {
  return fetchTime + ttl >= Date.now();
}
