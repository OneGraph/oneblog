// @flow

import { Environment, Network, RecordSource, Store } from "relay-runtime";

import OneGraphAuth from "onegraph-auth";

const ONEGRAPH_APP_ID = "d3715c55-faa9-42b8-921f-688ce0efd230";

export const onegraphAuth = new OneGraphAuth({
  appId: ONEGRAPH_APP_ID,
  oneGraphOrigin: "https://serve.onegraph.io"
});

function fetchQuery(operation, variables) {
  return fetch("https://serve.onegraph.io/dynamic?app_id=" + ONEGRAPH_APP_ID, {
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
  }).then(response => {
    // TODO: clear auth on 401
    return response.json();
  });
}

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
