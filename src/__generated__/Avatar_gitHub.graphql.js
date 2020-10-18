/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
export type GitHubRepositoryPermission = "ADMIN" | "MAINTAIN" | "READ" | "TRIAGE" | "WRITE" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type Avatar_gitHub$ref: FragmentReference;
declare export opaque type Avatar_gitHub$fragmentType: Avatar_gitHub$ref;
export type Avatar_gitHub = {|
  +viewer: {|
    +login: string,
    +avatarUrl: any,
  |},
  +repository: ?{|
    +viewerPermission: ?GitHubRepositoryPermission,
    +viewerCanAdminister: boolean,
  |},
  +$refType: Avatar_gitHub$ref,
|};
export type Avatar_gitHub$data = Avatar_gitHub;
export type Avatar_gitHub$key = {
  +$data?: Avatar_gitHub$data,
  +$fragmentRefs: Avatar_gitHub$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "Avatar_gitHub",
  "type": "GitHubQuery",
  "metadata": null,
  "argumentDefinitions": [
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
        }
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
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '0bc3f8e722e283afe0a0193518a3d33b';
module.exports = node;
