/**
 * @flow
 * @relayHash cb1633e7c05fc100c365f4ee754aa68c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Avatar_gitHub$ref = any;
export type LoginQuery_QueryVariables = {|
  repoName: string,
  repoOwner: string,
|};
export type LoginQuery_QueryResponse = {|
  +gitHub: ?{|
    +$fragmentRefs: Avatar_gitHub$ref
  |}
|};
export type LoginQuery_Query = {|
  variables: LoginQuery_QueryVariables,
  response: LoginQuery_QueryResponse,
|};
*/


/*
query LoginQuery_Query(
  $repoName: String!
  $repoOwner: String!
) @persistedQueryConfiguration(fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}) {
  gitHub {
    ...Avatar_gitHub_1Os64M
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
v1 = {
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
    "name": "LoginQuery_Query",
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
    "name": "LoginQuery_Query",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "login",
                "args": null,
                "storageKey": null
              },
              {
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
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "repository",
            "storageKey": null,
            "args": [
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
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "LoginQuery_Query",
    "id": "f4bef646-baba-4164-8015-2a8523d3f534",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3d2954b0e37ced2180f30cf5716c1d66';
module.exports = node;
