/**
 * @flow
 * @relayHash f0a98fab87305eb99d6eeb07391d43a0
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type GitHubRemoveReactionInput = {|
  clientMutationId?: ?string,
  content: GitHubReactionContent,
  subjectId: string,
|};
export type Post_RemoveReactionMutationVariables = {|
  input: GitHubRemoveReactionInput
|};
export type Post_RemoveReactionMutationResponse = {|
  +gitHub: ?{|
    +removeReaction: ?{|
      +reaction: ?{|
        +content: GitHubReactionContent,
        +user: ?{|
          +login: string
        |},
      |}
    |}
  |}
|};
export type Post_RemoveReactionMutation = {|
  variables: Post_RemoveReactionMutationVariables,
  response: Post_RemoveReactionMutationResponse,
|};
*/


/*
mutation Post_RemoveReactionMutation(
  $input: GitHubRemoveReactionInput!
) {
  gitHub {
    removeReaction(input: $input) {
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
    "type": "GitHubRemoveReactionInput!",
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
    "name": "Post_RemoveReactionMutation",
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
            "name": "removeReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubRemoveReactionPayload",
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
    "name": "Post_RemoveReactionMutation",
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
            "name": "removeReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubRemoveReactionPayload",
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
    "name": "Post_RemoveReactionMutation",
    "id": "6cbe875b-032b-477c-b7ed-9c18721fb908",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '05bba191eb94ffe772255f1e2cfa6d43';
module.exports = node;
