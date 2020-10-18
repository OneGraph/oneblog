/**
 * @flow
 * @relayHash 9263fcf9d6f51c1b426af471b7adb4a8
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type Sitemap_QueryVariables = {|
  repoOwner: string,
  repoName: string,
  cursor?: ?string,
  subdomain: string,
|};
export type Sitemap_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issues: {|
        +pageInfo: {|
          +hasNextPage: boolean,
          +endCursor: ?string,
        |},
        +nodes: ?$ReadOnlyArray<?{|
          +number: number,
          +title: string,
          +updatedAt: any,
        |}>,
      |}
    |}
  |}
|};
export type Sitemap_Query = {|
  variables: Sitemap_QueryVariables,
  response: Sitemap_QueryResponse,
|};
*/


/*
query Sitemap_Query(
  $repoOwner: String!
  $repoName: String!
  $cursor: String
  $subdomain: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, freeVariables: ["cursor", "subdomain"], cacheSeconds: 300) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issues(first: 100, after: $cursor, orderBy: {direction: DESC, field: CREATED_AT}, filterBy: {createdBy: $subdomain}, labels: ["publish", "Publish"]) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          number
          title
          updatedAt
          id
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
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "subdomain",
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
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "ObjectValue",
    "name": "filterBy",
    "fields": [
      {
        "kind": "Variable",
        "name": "createdBy",
        "variableName": "subdomain"
      }
    ]
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
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
v3 = {
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "number",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "updatedAt",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Sitemap_Query",
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issues",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "GitHubIssueConnection",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "nodes",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubIssue",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Sitemap_Query",
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issues",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "GitHubIssueConnection",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "nodes",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubIssue",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/)
                    ]
                  }
                ]
              },
              (v7/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Sitemap_Query",
    "id": "80a7823a-d591-44ae-b823-c1ad5b9a8f1d",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '04d0658ae094fc4f41b6f56c466d5ad0';
module.exports = node;
