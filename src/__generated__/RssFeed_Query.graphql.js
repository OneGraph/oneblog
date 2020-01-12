/**
 * @flow
 * @relayHash ea1fffdccaa6e525c992a070507218ea
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type RssFeed_QueryVariables = {|
  repoOwner: string,
  repoName: string,
|};
export type RssFeed_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issues: {|
        +nodes: ?$ReadOnlyArray<?{|
          +id: string,
          +number: number,
          +title: string,
          +body: string,
          +createdAt: string,
          +updatedAt: string,
          +assignees: {|
            +nodes: ?$ReadOnlyArray<?{|
              +id: string,
              +name: ?string,
              +login: string,
              +avatarUrl: string,
              +url: string,
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
              +avatarUrl: string,
            |},
          |},
        |}>
      |}
    |}
  |}
|};
export type RssFeed_Query = {|
  variables: RssFeed_QueryVariables,
  response: RssFeed_QueryResponse,
|};
*/


/*
query RssFeed_Query(
  $repoOwner: String!
  $repoName: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issues(first: 20, orderBy: {direction: DESC, field: CREATED_AT}, labels: ["publish", "Publish"]) {
        nodes {
          id
          number
          title
          body
          createdAt
          updatedAt
          assignees(first: 10) {
            nodes {
              id
              name
              login
              avatarUrl
              url
            }
          }
          reactionGroups {
            content
            viewerHasReacted
            users(first: 11) {
              totalCount
              nodes {
                login
                name
                id
              }
            }
          }
          commentsCount: comments {
            totalCount
          }
          repository {
            name
            owner {
              __typename
              login
              avatarUrl(size: 192)
              id
            }
            id
          }
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
    "name": "first",
    "value": 20
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
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
  "name": "body",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "createdAt",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "updatedAt",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v11 = {
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
        (v3/*: any*/),
        (v9/*: any*/),
        (v10/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "avatarUrl",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "content",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "viewerHasReacted",
  "args": null,
  "storageKey": null
},
v14 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 11
  }
],
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "LinkedField",
  "alias": "commentsCount",
  "name": "comments",
  "storageKey": null,
  "args": null,
  "concreteType": "GitHubIssueCommentConnection",
  "plural": false,
  "selections": [
    (v15/*: any*/)
  ]
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
  "args": [
    {
      "kind": "Literal",
      "name": "size",
      "value": 192
    }
  ],
  "storageKey": "avatarUrl(size:192)"
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RssFeed_Query",
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
                "storageKey": "issues(first:20,labels:[\"publish\",\"Publish\"],orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v11/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "reactionGroups",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubReactionGroup",
                        "plural": true,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "users",
                            "storageKey": "users(first:11)",
                            "args": (v14/*: any*/),
                            "concreteType": "GitHubReactingUserConnection",
                            "plural": false,
                            "selections": [
                              (v15/*: any*/),
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "nodes",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "GitHubUser",
                                "plural": true,
                                "selections": [
                                  (v10/*: any*/),
                                  (v9/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v16/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "repository",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubRepository",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "owner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              (v10/*: any*/),
                              (v17/*: any*/)
                            ]
                          }
                        ]
                      }
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
    "name": "RssFeed_Query",
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
                "storageKey": "issues(first:20,labels:[\"publish\",\"Publish\"],orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v11/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "reactionGroups",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubReactionGroup",
                        "plural": true,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "users",
                            "storageKey": "users(first:11)",
                            "args": (v14/*: any*/),
                            "concreteType": "GitHubReactingUserConnection",
                            "plural": false,
                            "selections": [
                              (v15/*: any*/),
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "nodes",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "GitHubUser",
                                "plural": true,
                                "selections": [
                                  (v10/*: any*/),
                                  (v9/*: any*/),
                                  (v3/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v16/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "repository",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubRepository",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "owner",
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
                              (v10/*: any*/),
                              (v17/*: any*/),
                              (v3/*: any*/)
                            ]
                          },
                          (v3/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RssFeed_Query",
    "id": "b2b29f47-6d16-47cb-957b-d28e79c31483",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '269a15610b79ee61825ccd0d5d3a3ee2';
module.exports = node;
