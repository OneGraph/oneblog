/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Post_post$ref: FragmentReference;
declare export opaque type Post_post$fragmentType: Post_post$ref;
export type Post_post = {|
  +id: string,
  +number: number,
  +title: string,
  +body: string,
  +createdAt: any,
  +updatedAt: any,
  +assignees: {|
    +nodes: ?$ReadOnlyArray<?{|
      +id: string,
      +name: ?string,
      +login: string,
      +avatarUrl: any,
      +url: any,
      +twitterUsername: ?string,
      +websiteUrl: ?any,
    |}>
  |},
  +reactionGroups: ?$ReadOnlyArray<{|
    +content: GitHubReactionContent,
    +viewerHasReacted: boolean,
    +users: {|
      +totalCount: number,
      +nodes: ?$ReadOnlyArray<?{|
        +login: string,
        +name: ?string,
        +isViewer: boolean,
      |}>,
    |},
  |}>,
  +commentsCount: {|
    +totalCount: number
  |},
  +repository: {|
    +name: string,
    +owner: {|
      +login: string,
      +avatarUrl: any,
    |},
  |},
  +$refType: Post_post$ref,
|};
export type Post_post$data = Post_post;
export type Post_post$key = {
  +$data?: Post_post$data,
  +$fragmentRefs: Post_post$ref,
  ...
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
  "name": "name",
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Post_post",
  "type": "GitHubIssue",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
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
      "alias": "body",
      "name": "__body_registerMarkdown",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "updatedAt",
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
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "twitterUsername",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "websiteUrl",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
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
            (v4/*: any*/),
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
                (v1/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isViewer",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "commentsCount",
      "name": "comments",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubIssueCommentConnection",
      "plural": false,
      "selections": [
        (v4/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "repository",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubRepository",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "owner",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [
            (v2/*: any*/),
            (v3/*: any*/)
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd50f84fee1ef98dbb54498b0a028f110';
module.exports = node;
