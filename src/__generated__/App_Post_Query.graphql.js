/**
 * @flow
 * @relayHash 2da579ebae0ef223c4a5f8f09a955e02
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Comments_post$ref = any;
type Post_post$ref = any;
export type App_Post_QueryVariables = {|
  issueNumber: number,
  repoName: string,
  repoOwner: string,
|};
export type App_Post_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +issue: ?{|
        +labels: ?{|
          +nodes: ?$ReadOnlyArray<?{|
            +name: string
          |}>
        |},
        +id: string,
        +$fragmentRefs: Post_post$ref & Comments_post$ref,
      |}
    |}
  |}
|};
export type App_Post_Query = {|
  variables: App_Post_QueryVariables,
  response: App_Post_QueryResponse,
|};
*/


/*
query App_Post_Query(
  $issueNumber: Int!
  $repoName: String!
  $repoOwner: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, freeVariables: ["issueNumber"]) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        labels(first: 100) {
          nodes {
            name
            id
          }
        }
        id
        ...Post_post
        ...Comments_post
      }
      id
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

fragment Comments_post on GitHubIssue {
  comments(first: 100) {
    edges {
      node {
        id
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

fragment Comment_comment on GitHubIssueComment {
  id
  body
  createdViaEmail
  author {
    __typename
    ... on GitHubUser {
      name
      avatarUrl
      login
      url
      id
    }
    ... on GitHubBot {
      avatarUrl
      login
      url
      id
    }
    ... on GitHubOrganization {
      name
      avatarUrl
      login
      url
      id
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
v2 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "issueNumber"
  }
],
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
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
  "name": "login",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v12 = {
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
        (v11/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "nodes",
          "storageKey": null,
          "args": null,
          "concreteType": "GitHubUser",
          "plural": true,
          "selections": [
            (v8/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/)
          ]
        }
      ]
    }
  ]
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v14 = [
  (v4/*: any*/),
  (v9/*: any*/),
  (v8/*: any*/),
  (v10/*: any*/),
  (v5/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "App_Post_Query",
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
                "name": "issue",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "labels",
                    "storageKey": "labels(first:100)",
                    "args": (v3/*: any*/),
                    "concreteType": "GitHubLabelConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "nodes",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubLabel",
                        "plural": true,
                        "selections": [
                          (v4/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v5/*: any*/),
                  {
                    "kind": "FragmentSpread",
                    "name": "Post_post",
                    "args": null
                  },
                  {
                    "kind": "FragmentSpread",
                    "name": "Comments_post",
                    "args": null
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
    "name": "App_Post_Query",
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
                "name": "issue",
                "storageKey": null,
                "args": (v2/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "labels",
                    "storageKey": "labels(first:100)",
                    "args": (v3/*: any*/),
                    "concreteType": "GitHubLabelConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "nodes",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubLabel",
                        "plural": true,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/)
                        ]
                      }
                    ]
                  },
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
                  (v6/*: any*/),
                  (v7/*: any*/),
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
                          (v4/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v10/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v12/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "commentsCount",
                    "name": "comments",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubIssueCommentConnection",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/)
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
                      (v4/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "owner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v13/*: any*/),
                          (v8/*: any*/),
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
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "comments",
                    "storageKey": "comments(first:100)",
                    "args": (v3/*: any*/),
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
                              (v6/*: any*/),
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
                                  (v13/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubUser",
                                    "selections": (v14/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubBot",
                                    "selections": [
                                      (v9/*: any*/),
                                      (v8/*: any*/),
                                      (v10/*: any*/),
                                      (v5/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubOrganization",
                                    "selections": (v14/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubMannequin",
                                    "selections": [
                                      (v5/*: any*/),
                                      (v8/*: any*/),
                                      (v10/*: any*/)
                                    ]
                                  }
                                ]
                              },
                              (v7/*: any*/),
                              (v12/*: any*/),
                              (v13/*: any*/)
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
                    "args": (v3/*: any*/),
                    "handle": "connection",
                    "key": "Comments_post_comments",
                    "filters": null
                  }
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
    "name": "App_Post_Query",
    "id": "46c4c159-8134-4f1a-9ab4-b45399cb2032",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e4e12bfd5778781b0ffc768ff7273360';
module.exports = node;
