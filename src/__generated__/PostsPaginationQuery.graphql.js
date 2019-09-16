/**
 * @flow
 * @relayHash a42fb5529c1e66cc99890a33a603c99a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Posts_repository$ref = any;
export type GitHubIssueOrderField = "COMMENTS" | "CREATED_AT" | "UPDATED_AT" | "%future added value";
export type GitHubOrderDirection = "ASC" | "DESC" | "%future added value";
export type GitHubIssueOrder = {|
  direction: GitHubOrderDirection,
  field: GitHubIssueOrderField,
|};
export type PostsPaginationQueryVariables = {|
  count: number,
  cursor?: ?string,
  orderBy?: ?GitHubIssueOrder,
  repoOwner: string,
  repoName: string,
|};
export type PostsPaginationQueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +__typename: string,
      +$fragmentRefs: Posts_repository$ref,
    |}
  |}
|};
export type PostsPaginationQuery = {|
  variables: PostsPaginationQueryVariables,
  response: PostsPaginationQueryResponse,
|};
*/


/*
query PostsPaginationQuery(
  $count: Int!
  $cursor: String
  $orderBy: GitHubIssueOrder
  $repoOwner: String!
  $repoName: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, freeVariables: ["count", "cursor", "orderBy"], fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      __typename
      ...Posts_repository_32czeo
      id
    }
  }
}

fragment Posts_repository_32czeo on GitHubRepository {
  issues(first: $count, after: $cursor, orderBy: $orderBy, labels: ["publish", "Publish"]) {
    edges {
      node {
        id
        ...Post_post
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment Post_post on GitHubIssue {
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
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
    "defaultValue": null
  },
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
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "Variable",
  "name": "orderBy",
  "variableName": "orderBy"
},
v4 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "labels",
    "value": [
      "publish",
      "Publish"
    ]
  },
  (v3/*: any*/)
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PostsPaginationQuery",
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
              (v2/*: any*/),
              {
                "kind": "FragmentSpread",
                "name": "Posts_repository",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "count",
                    "variableName": "count"
                  },
                  {
                    "kind": "Variable",
                    "name": "cursor",
                    "variableName": "cursor"
                  },
                  (v3/*: any*/)
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
    "name": "PostsPaginationQuery",
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
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issues",
                "storageKey": null,
                "args": (v4/*: any*/),
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
                          (v5/*: any*/),
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
                            "alias": null,
                            "name": "body",
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
                                  (v5/*: any*/),
                                  (v6/*: any*/),
                                  (v7/*: any*/),
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
                                  (v8/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "nodes",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "GitHubUser",
                                    "plural": true,
                                    "selections": [
                                      (v7/*: any*/),
                                      (v5/*: any*/)
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
                              (v8/*: any*/)
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
                              (v6/*: any*/),
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
                                  (v7/*: any*/),
                                  {
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
                                  },
                                  (v5/*: any*/)
                                ]
                              },
                              (v5/*: any*/)
                            ]
                          },
                          (v2/*: any*/)
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
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "issues",
                "args": (v4/*: any*/),
                "handle": "connection",
                "key": "Posts_posts_issues",
                "filters": [
                  "orderBy",
                  "labels"
                ]
              },
              (v5/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PostsPaginationQuery",
    "id": "99df7ec7-a065-4b68-aa1e-a891a10c62bf",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5729094fcf4421ecce17c2fbccd6da7e';
module.exports = node;
