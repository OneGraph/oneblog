/**
 * @flow
 * @relayHash 7e9bb4586a658bde383cc41381efed47
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Posts_repository$ref = any;
export type App_QueryVariables = {|
  repoName: string,
  repoOwner: string,
|};
export type App_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +$fragmentRefs: Posts_repository$ref
    |}
  |}
|};
export type App_Query = {|
  variables: App_QueryVariables,
  response: App_QueryResponse,
|};
*/


/*
query App_Query(
  $repoName: String!
  $repoOwner: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      ...Posts_repository
      id
    }
  }
}

fragment Posts_repository on GitHubRepository {
  issues(first: 10, orderBy: {direction: DESC, field: CREATED_AT}, labels: ["publish", "Publish"]) {
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
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v3 = [
  (v2/*: any*/),
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "App_Query",
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
                "kind": "FragmentSpread",
                "name": "Posts_repository",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "App_Query",
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
                "storageKey": "issues(first:10,labels:[\"publish\",\"Publish\"],orderBy:{\"direction\":\"DESC\",\"field\":\"CREATED_AT\"})",
                "args": (v3/*: any*/),
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
                          (v4/*: any*/),
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
                              (v2/*: any*/)
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
                                  (v4/*: any*/),
                                  (v5/*: any*/),
                                  (v6/*: any*/),
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
                                  (v7/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "nodes",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "GitHubUser",
                                    "plural": true,
                                    "selections": [
                                      (v6/*: any*/),
                                      (v4/*: any*/)
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
                              (v7/*: any*/)
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
                              (v5/*: any*/),
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "owner",
                                "storageKey": null,
                                "args": null,
                                "concreteType": null,
                                "plural": false,
                                "selections": [
                                  (v8/*: any*/),
                                  (v6/*: any*/),
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
                                  (v4/*: any*/)
                                ]
                              },
                              (v4/*: any*/)
                            ]
                          },
                          (v8/*: any*/)
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
                "args": (v3/*: any*/),
                "handle": "connection",
                "key": "Posts_posts_issues",
                "filters": [
                  "orderBy",
                  "labels"
                ]
              },
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "App_Query",
    "id": "90b67c51-fb51-4812-a413-2a796f28fe40",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f9d409138fbdc489c0a66f8825038a59';
module.exports = node;
