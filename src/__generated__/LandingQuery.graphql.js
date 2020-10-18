/**
 * @flow
 * @relayHash d809ca6e0740b7f0a29ad6e7486a0749
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Avatar_gitHub$ref = any;
export type LandingQueryVariables = {|
  repoName: string,
  repoOwner: string,
|};
export type LandingQueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issues: {|
        +nodes: ?$ReadOnlyArray<?{|
          +number: number,
          +title: string,
          +author: ?{|
            +login: string,
            +avatarUrl: any,
            +name?: ?string,
          |},
        |}>
      |}
    |},
    +$fragmentRefs: Avatar_gitHub$ref,
  |}
|};
export type LandingQuery = {|
  variables: LandingQueryVariables,
  response: LandingQueryResponse,
|};
*/


/*
query LandingQuery(
  $repoName: String!
  $repoOwner: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, cacheSeconds: 300) {
  gitHub {
    ...Avatar_gitHub_1Os64M
    repository(name: $repoName, owner: $repoOwner) {
      issues(filterBy: {labels: ["Highlight"]}, orderBy: {field: CREATED_AT, direction: DESC}, first: 10) {
        nodes {
          number
          title
          author {
            __typename
            login
            ... on GitHubUser {
              name
            }
            avatarUrl(size: 96)
          }
          id
        }
      }
      id
    }
  }
}

fragment Avatar_gitHub_1Os64M on GitHubQuery {
  viewer {
    login
    avatarUrl(size: 96)
    id
  }
  repository(name: $repoName, owner: $repoOwner) {
    viewerPermission
    viewerCanAdminister
    id
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
    "kind": "Literal",
    "name": "filterBy",
    "value": {
      "labels": [
        "Highlight"
      ]
    }
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
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
  "kind": "ScalarField",
  "alias": null,
  "name": "number",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
  "args": [
    {
      "kind": "Literal",
      "name": "size",
      "value": 96
    }
  ],
  "storageKey": "avatarUrl(size:96)"
},
v7 = {
  "kind": "InlineFragment",
  "type": "GitHubUser",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
},
v8 = {
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
    "name": "LandingQuery",
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
                "storageKey": "issues(filterBy:{\"labels\":[\"Highlight\"]},first:10,orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
                "args": (v2/*: any*/),
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
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "FragmentSpread",
            "name": "Avatar_gitHub",
            "args": [
              {
                "kind": "Variable",
                "name": "repoName",
                "variableName": "repoName"
              },
              {
                "kind": "Variable",
                "name": "repoOwner",
                "variableName": "repoOwner"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LandingQuery",
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
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v8/*: any*/)
            ]
          },
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
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerPermission",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerCanAdminister",
                "args": null,
                "storageKey": null
              },
              (v8/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issues",
                "storageKey": "issues(filterBy:{\"labels\":[\"Highlight\"]},first:10,orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
                "args": (v2/*: any*/),
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
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "__typename",
                            "args": null,
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/)
                        ]
                      },
                      (v8/*: any*/)
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
  "params": {
    "operationKind": "query",
    "name": "LandingQuery",
    "id": "636cc0ec-1bc9-48ca-ad13-1884fa55eab2",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6a71239ac93af28b490534360d7625cd';
module.exports = node;
