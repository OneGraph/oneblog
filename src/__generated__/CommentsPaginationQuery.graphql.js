/**
 * @flow
 * @relayHash 67ce9963efee64c723c93de0122aaf60
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Comments_post$ref = any;
export type CommentsPaginationQueryVariables = {|
  count: number,
  cursor?: ?string,
  issueNumber: number,
  repoName: string,
  repoOwner: string,
|};
export type CommentsPaginationQueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +__typename: string,
      +issue: ?{|
        +$fragmentRefs: Comments_post$ref
      |},
    |}
  |}
|};
export type CommentsPaginationQuery = {|
  variables: CommentsPaginationQueryVariables,
  response: CommentsPaginationQueryResponse,
|};
*/


/*
query CommentsPaginationQuery(
  $count: Int!
  $cursor: String
  $issueNumber: Int!
  $repoName: String!
  $repoOwner: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, freeVariables: ["count", "cursor", "issueNumber"], fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, cacheSeconds: 300) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      __typename
      issue(number: $issueNumber) {
        ...Comments_post_1G22uz
        id
      }
      id
    }
  }
}

fragment Comment_comment on GitHubIssueComment {
  id
  body
  createdViaEmail
  author {
    __typename
    ... on GitHubUser {
      name
      avatarUrl(size: 96)
      login
      url
    }
    ... on GitHubBot {
      avatarUrl(size: 96)
      login
      url
    }
    ... on GitHubOrganization {
      name
      avatarUrl(size: 96)
      login
      url
    }
    ... on GitHubMannequin {
      id
      login
      url
    }
  }
  createdAt
  reactionGroups {
    content
    viewerHasReacted
    users(first: 11) {
      totalCount
      nodes {
        login
        name
        isViewer
        id
      }
    }
  }
}

fragment Comments_post_1G22uz on GitHubIssue {
  comments(first: $count, after: $cursor) {
    edges {
      node {
        id
        author {
          __typename
          login
        }
        ...Comment_comment
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
    "name": "issueNumber",
    "type": "Int!",
    "defaultValue": null
  },
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
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "issueNumber"
  }
],
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
  }
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
  "name": "login",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = {
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
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v10 = [
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CommentsPaginationQuery",
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
                "kind": "LinkedField",
                "alias": null,
                "name": "issue",
                "storageKey": null,
                "args": (v3/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "Comments_post",
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
    "name": "CommentsPaginationQuery",
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
                "name": "issue",
                "storageKey": null,
                "args": (v3/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "comments",
                    "storageKey": null,
                    "args": (v4/*: any*/),
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
                              (v5/*: any*/),
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "author",
                                "storageKey": null,
                                "args": null,
                                "concreteType": null,
                                "plural": false,
                                "selections": [
                                  (v2/*: any*/),
                                  (v6/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubUser",
                                    "selections": (v10/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubBot",
                                    "selections": [
                                      (v8/*: any*/),
                                      (v9/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubOrganization",
                                    "selections": (v10/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubMannequin",
                                    "selections": [
                                      (v5/*: any*/),
                                      (v9/*: any*/)
                                    ]
                                  }
                                ]
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "body",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarHandle",
                                "alias": null,
                                "name": "body",
                                "args": null,
                                "handle": "registerMarkdown",
                                "key": "",
                                "filters": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "createdViaEmail",
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
                                          (v6/*: any*/),
                                          (v7/*: any*/),
                                          {
                                            "kind": "ScalarField",
                                            "alias": null,
                                            "name": "isViewer",
                                            "args": null,
                                            "storageKey": null
                                          },
                                          (v5/*: any*/)
                                        ]
                                      }
                                    ]
                                  }
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
                    "name": "comments",
                    "args": (v4/*: any*/),
                    "handle": "connection",
                    "key": "Comments_post_comments",
                    "filters": null
                  },
                  (v5/*: any*/)
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
    "name": "CommentsPaginationQuery",
    "id": "7a9bc529-be9d-4df8-873e-67f6771d7b0f",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5b5e9b2d70b140e74df976fdf87a24e4';
module.exports = node;
