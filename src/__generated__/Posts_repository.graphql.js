/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type Post_post$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Posts_repository$ref: FragmentReference;
declare export opaque type Posts_repository$fragmentType: Posts_repository$ref;
export type Posts_repository = {|
  +issues: {|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +$fragmentRefs: Post_post$ref,
      |}
    |}>
  |},
  +$refType: Posts_repository$ref,
|};
export type Posts_repository$data = Posts_repository;
export type Posts_repository$key = {
  +$data?: Posts_repository$data,
  +$fragmentRefs: Posts_repository$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "Posts_repository",
  "type": "GitHubRepository",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "issues"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "orderBy",
      "type": "GitHubIssueOrder",
      "defaultValue": {
        "direction": "DESC",
        "field": "CREATED_AT"
      }
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "issues",
      "name": "__Posts_posts_issues_connection",
      "storageKey": null,
      "args": [
        {
          "kind": "Literal",
          "name": "labels",
          "value": [
            "publish",
            "Publish"
          ]
        },
        {
          "kind": "Variable",
          "name": "orderBy",
          "variableName": "orderBy"
        }
      ],
      "concreteType": "GitHubIssueConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "GitHubIssueEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "GitHubIssue",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "Post_post",
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
(node/*: any*/).hash = '860e2f92953cab35d8e06b5c493cca24';
module.exports = node;
