// @flow

import stableCopy from 'relay-runtime/lib/stableCopy';

import type {Variables} from 'relay-runtime/lib/RelayRuntimeTypes';
import type {GraphQLResponse} from 'relay-runtime/lib/RelayNetworkTypes';

type Response = {
  fetchTime: number,
  payload: Promise<GraphQLResponse>,
};

/**
 * A cache for storing query responses, featuring:
 * - `get` with TTL
 * - cache size limiting, with least-recently *updated* entries purged first
 */
export default class RelayQueryResponseCache {
  _responses: Map<string, Response>;
  _size: number;
  _ttl: number;

  constructor({size, ttl}: {size: number, ttl: number}) {
    this._responses = new Map();
    this._size = Math.max(1, size);
    this._ttl = Math.max(1, ttl);
  }

  clear(): void {
    this._responses.clear();
  }

  get(queryID: string, variables: Variables): ?Promise<GraphQLResponse> {
    const cacheKey = getCacheKey(queryID, variables);
    this._responses.forEach((response, key) => {
      if (!isCurrent(response.fetchTime, this._ttl)) {
        this._responses.delete(key);
      }
    });
    const response = this._responses.get(cacheKey);
    return response != null
      ? response.payload.then(
          payload =>
            ({
              ...payload,
              extensions: {
                ...payload.extensions,
                cacheTimestamp: response.fetchTime,
              },
            }: GraphQLResponse),
        )
      : null;
  }

  set(
    queryID: string,
    variables: Variables,
    payload: Promise<GraphQLResponse>,
  ): void {
    const fetchTime = Date.now();
    const cacheKey = getCacheKey(queryID, variables);
    this._responses.delete(cacheKey); // deletion resets key ordering
    this._responses.set(cacheKey, {
      fetchTime,
      payload,
    });
    // Purge least-recently updated key when max size reached
    if (this._responses.size > this._size) {
      const firstKey = this._responses.keys().next();
      if (!firstKey.done) {
        this._responses.delete(firstKey.value);
      }
    }
  }
}

function getCacheKey(queryID: string, variables: Variables): string {
  return JSON.stringify(stableCopy({queryID, variables}));
}

/**
 * Determine whether a response fetched at `fetchTime` is still valid given
 * some `ttl`.
 */
function isCurrent(fetchTime: number, ttl: number): boolean {
  return fetchTime + ttl >= Date.now();
}
