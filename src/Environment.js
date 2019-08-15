// @flow

import { Environment, Network, RecordSource, Store } from "relay-runtime";
import RelayQueryResponseCache from "./relayResponseCache";

import OneGraphAuth from "onegraph-auth";

const ONEGRAPH_APP_ID = "570a3d6b-6ff3-4b7a-9b0d-fe4cf6384388";

export const onegraphAuth = new OneGraphAuth({
  appId: ONEGRAPH_APP_ID,
  communicationMode: "post_message"
});

const cache = new RelayQueryResponseCache({ size: 250, ttl: 1000 * 60 * 10 });

function fetchQuery(operation, variables, cacheConfig) {
  const queryId = operation.id || operation.text;
  const forceFetch = cacheConfig && cacheConfig.force;
  const fromCache = cache.get(queryId, variables);
  const isMutation = operation.operationKind === "mutation";
  const isQuery = operation.operationKind === "query";

  if (isQuery && fromCache !== null && !forceFetch) {
    console.log("fromCache", fromCache);
    return fromCache;
  }

  const resp = fetch(
    "https://serve.onegraph.com/graphql?app_id=" + ONEGRAPH_APP_ID,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...onegraphAuth.authHeaders()
      },
      body: JSON.stringify({
        doc_id: operation.id,
        query: operation.text,
        variables
      })
    }
  ).then(response =>
    response.json().then(json => {
      // Clear full cache on mutation or if we get an error
      if (isMutation || !json.data || !json.data.gitHub) {
        cache.clear();
      }
      if (json.data.gitHub == null) {
        return {
          ...json,
          data: null
        };
      }
      return json;
    })
  );

  // TODO: clear auth on 401
  if (isQuery) {
    cache.set(queryId, variables, resp);
  }
  return resp;
}

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
