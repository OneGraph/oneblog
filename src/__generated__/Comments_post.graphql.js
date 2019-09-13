/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type Comment_comment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Comments_post$ref: FragmentReference;
declare export opaque type Comments_post$fragmentType: Comments_post$ref;
export type Comments_post = {|
  +comments: {|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +$fragmentRefs: Comment_comment$ref
      |}
    |}>
  |},
  +$refType: Comments_post$ref,
|};
export type Comments_post$data = Comments_post;
export type Comments_post$key = {
  +$data?: Comments_post$data,
  +$fragmentRefs: Comments_post$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "Comments_post",
  "type": "GitHubIssue",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "comments"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 100
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "comments",
      "name": "__Comments_post_comments_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "GitHubIssueCommentConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "GitHubIssueCommentEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "GitHubIssueComment",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Comment_comment",
                  "args": null
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            }
          ]
        },
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
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'c18e48e4a6a5ec2d3e2417abdafcfc3a';
module.exports = node;
