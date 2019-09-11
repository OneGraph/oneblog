/**
 * @flow
 * @relayHash 537b721ffe865b904b58db537705c2b6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type GitHubAddReactionInput = {|
  clientMutationId?: ?string,
  content: GitHubReactionContent,
  subjectId: string,
|};
export type Post_AddReactionMutationVariables = {|
  input: GitHubAddReactionInput
|};
export type Post_AddReactionMutationResponse = {|
  +gitHub: ?{|
    +addReaction: ?{|
      +reaction: ?{|
        +content: GitHubReactionContent,
        +user: ?{|
          +login: string
        |},
      |}
    |}
  |}
|};
export type Post_AddReactionMutation = {|
  variables: Post_AddReactionMutationVariables,
  response: Post_AddReactionMutationResponse,
|};
*/


/*
mutation Post_AddReactionMutation(
  $input: GitHubAddReactionInput!
) {
  gitHub {
    addReaction(input: $input) {
      reaction {
        content
        user {
          login
          id
        }
        id
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "GitHubAddReactionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "content",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v4 = {
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
    "name": "Post_AddReactionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "addReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddReactionPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "reaction",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubReaction",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "user",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubUser",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/)
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
    "name": "Post_AddReactionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "addReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddReactionPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "reaction",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubReaction",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "user",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubUser",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ]
                  },
                  (v4/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "Post_AddReactionMutation",
    "id": "975ffe8c-669c-4011-b12a-f59fa0aca813",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5d62de9c17f536fef2453f920b4f27ec';
module.exports = node;
