/**
 * @flow
 * @relayHash 669592e0d46ae92b84cadb07ea48d136
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type RssFeed_QueryVariables = {||};
export type RssFeed_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issues: {|
        +nodes: ?$ReadOnlyArray<?{|
          +id: string,
          +number: number,
          +title: string,
          +bodyHTML: string,
          +createdAt: string,
          +assignees: {|
            +nodes: ?$ReadOnlyArray<?{|
              +id: string,
              +name: ?string,
              +url: string,
            |}>
          |},
        |}>
      |}
    |}
  |}
|};
export type RssFeed_Query = {|
  variables: RssFeed_QueryVariables,
  response: RssFeed_QueryResponse,
|};
*/


/*
query RssFeed_Query @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}) {
  gitHub {
    repository(name: "onegraph-changelog", owner: "onegraph") {
      issues(first: 20, orderBy: {direction: DESC, field: CREATED_AT}, labels: ["publish"]) {
        nodes {
          id
          number
          title
          bodyHTML
          createdAt
          assignees(first: 10) {
            nodes {
              id
              name
              url
            }
          }
        }
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "name",
    "value": "onegraph-changelog"
  },
  {
    "kind": "Literal",
    "name": "owner",
    "value": "onegraph"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "issues",
  "storageKey": "issues(first:20,labels:[\"publish\"],orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 20
    },
    {
      "kind": "Literal",
      "name": "labels",
      "value": [
        "publish"
      ]
    },
    {
      "kind": "Literal",
      "name": "orderBy",
      "value": {
        "direction": "DESC",
        "field": "CREATED_AT"
      }
    }
  ],
  "concreteType": "GitHubIssueConnection",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "nodes",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubIssue",
      "plural": true,
      "selections": [
        (v1/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "number",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "bodyHTML",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "createdAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "assignees",
          "storageKey": "assignees(first:10)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 10
            }
          ],
          "concreteType": "GitHubUserConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "nodes",
              "storageKey": null,
              "args": null,
              "concreteType": "GitHubUser",
              "plural": true,
              "selections": [
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "url",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RssFeed_Query",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubQuery",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "repository",
            "storageKey": "repository(name:\"onegraph-changelog\",owner:\"onegraph\")",
            "args": (v0/*: any*/),
            "concreteType": "GitHubRepository",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RssFeed_Query",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubQuery",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "repository",
            "storageKey": "repository(name:\"onegraph-changelog\",owner:\"onegraph\")",
            "args": (v0/*: any*/),
            "concreteType": "GitHubRepository",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RssFeed_Query",
    "id": "21f9f66b-66e7-4b2f-b7f3-7ca58b0a8440",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bd7322d53c6f4074b6313e86410452e2';
module.exports = node;
