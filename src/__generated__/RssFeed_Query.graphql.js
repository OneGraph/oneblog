/**
 * @flow
 * @relayHash f88bf112f5f0d60768c62bfd11999a80
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type RssFeed_QueryVariables = {|
  repoOwner: string,
  repoName: string,
|};
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
query RssFeed_Query(
  $repoOwner: String!
  $repoName: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issues(first: 20, orderBy: {direction: DESC, field: CREATED_AT}, labels: ["publish", "Publish"]) {
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
    "kind": "LocalArgument",
    "name": "repoOwner",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "repoName",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "repoName"
  },
  {
    "kind": "Variable",
    "name": "owner",
    "variableName": "repoOwner"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "issues",
  "storageKey": "issues(first:20,labels:[\"publish\",\"Publish\"],orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
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
        "publish",
        "Publish"
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
        (v2/*: any*/),
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
                (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
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
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubRepository",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RssFeed_Query",
    "argumentDefinitions": (v0/*: any*/),
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
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubRepository",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RssFeed_Query",
    "id": "743e9d8c-db5a-425d-b367-6b45550e9570",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'df01a1e179966ece338af9e6afbf7f3c';
module.exports = node;
