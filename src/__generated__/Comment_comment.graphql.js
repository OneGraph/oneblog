/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Comment_comment$ref: FragmentReference;
declare export opaque type Comment_comment$fragmentType: Comment_comment$ref;
export type Comment_comment = {|
  +id: string,
  +body: string,
  +createdViaEmail: boolean,
  +author: ?{|
    +name?: ?string,
    +avatarUrl?: string,
    +login?: string,
    +url?: string,
    +id?: string,
  |},
  +createdAt: string,
  +reactionGroups: ?$ReadOnlyArray<{|
    +content: GitHubReactionContent,
    +viewerHasReacted: boolean,
    +users: {|
      +totalCount: number,
      +nodes: ?$ReadOnlyArray<?{|
        +login: string
      |}>,
    |},
  |}>,
  +$refType: Comment_comment$ref,
|};
export type Comment_comment$data = Comment_comment;
export type Comment_comment$key = {
  +$data?: Comment_comment$data,
  +$fragmentRefs: Comment_comment$ref,
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v1/*: any*/),
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "Comment_comment",
  "type": "GitHubIssueComment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "body",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "createdViaEmail",
      "args": null,
      "storageKey": null
    },
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
          "kind": "InlineFragment",
          "type": "GitHubUser",
          "selections": (v4/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "GitHubBot",
          "selections": [
            (v1/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/)
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "GitHubOrganization",
          "selections": (v4/*: any*/)
        },
        {
          "kind": "InlineFragment",
          "type": "GitHubMannequin",
          "selections": [
            (v0/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/)
          ]
        }
      ]
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
      "name": "reactionGroups",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubReactionGroup",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "content",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "viewerHasReacted",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "users",
          "storageKey": "users(first:11)",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 11
            }
          ],
          "concreteType": "GitHubReactingUserConnection",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "totalCount",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "nodes",
              "storageKey": null,
              "args": null,
              "concreteType": "GitHubUser",
              "plural": true,
              "selections": [
                (v2/*: any*/)
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '1ee5f7e5a343f2b58e4b6e73c3d6a129';
module.exports = node;
