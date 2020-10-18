/**
 * @flow
 * @relayHash 7ee06c3c8e7c92f2a4d0f738d16e293e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type staticPaths_QueryVariables = {|
  repoName: string,
  repoOwner: string,
  count: number,
  cursor?: ?string,
|};
export type staticPaths_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issues: {|
        +pageInfo: {|
          +hasNextPage: boolean,
          +endCursor: ?string,
        |},
        +nodes: ?$ReadOnlyArray<?{|
          +title: string,
          +id: string,
          +number: number,
        |}>,
      |}
    |}
  |}
|};
export type staticPaths_Query = {|
  variables: staticPaths_QueryVariables,
  response: staticPaths_QueryResponse,
|};
*/


/*
query staticPaths_Query(
  $repoName: String!
  $repoOwner: String!
  $count: Int!
  $cursor: String
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, freeVariables: ["count", "cursor"], cacheSeconds: 60) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issues(first: $count, filterBy: {labels: ["publish", "Publish"]}, orderBy: {field: CREATED_AT, direction: DESC}, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          id
          number
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
    "name": "repoName",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "repoOwner",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
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
  "storageKey": null,
  "args": [
    {
      "kind": "Variable",
      "name": "after",
      "variableName": "cursor"
    },
    {
      "kind": "Literal",
      "name": "filterBy",
      "value": {
        "labels": [
          "publish",
          "Publish"
        ]
      }
    },
    {
      "kind": "Variable",
      "name": "first",
      "variableName": "count"
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
      "name": "pageInfo",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubPageInfo",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "hasNextPage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endCursor",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "nodes",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubIssue",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "title",
          "args": null,
          "storageKey": null
        },
        (v2/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "number",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "staticPaths_Query",
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
    "name": "staticPaths_Query",
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
    "name": "staticPaths_Query",
    "id": "40194819-5d3b-422f-9ec9-40ba9376fae0",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b3e5c54b1842d578fa70371ad5a3fa75';
module.exports = node;
