/**
 * @flow
 * @relayHash aa96ed353c0ae162b18d8ba23b45c0e7
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Avatar_gitHub$ref = any;
type Comments_post$ref = any;
type Post_post$ref = any;
export type PostRoot_PostQueryVariables = {|
  issueNumber: number,
  repoName: string,
  repoOwner: string,
  subdomain: string,
|};
export type PostRoot_PostQueryResponse = {|
  +gitHub: ?{|
    +viewer: {|
      +login: string,
      +name: ?string,
      +avatarUrl: any,
      +url: any,
    |},
    +repository: ?{|
      +issue: ?{|
        +author: ?{|
          +login: string,
          +name?: ?string,
        |},
        +labels: ?{|
          +nodes: ?$ReadOnlyArray<?{|
            +name: string
          |}>
        |},
        +title: string,
        +id: string,
        +number: number,
        +body: string,
        +$fragmentRefs: Post_post$ref & Comments_post$ref,
      |}
    |},
    +subdomainAuthor: ?{|
      +name: ?string,
      +login: string,
    |},
    +$fragmentRefs: Avatar_gitHub$ref,
  |}
|};
export type PostRoot_PostQuery = {|
  variables: PostRoot_PostQueryVariables,
  response: PostRoot_PostQueryResponse,
|};
*/


/*
query PostRoot_PostQuery(
  $issueNumber: Int!
  $repoName: String!
  $repoOwner: String!
  $subdomain: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, freeVariables: ["issueNumber", "subdomain"], cacheSeconds: 300) {
  gitHub {
    viewer {
      login
      name
      avatarUrl(size: 96)
      url
      id
    }
    ...Avatar_gitHub_1Os64M
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        author {
          __typename
          ... on GitHubUser {
            name
          }
          login
        }
        labels(first: 100) {
          nodes {
            name
            id
          }
        }
        title
        id
        number
        body
        ...Post_post
        ...Comments_post
      }
      id
    }
    subdomainAuthor: user(login: $subdomain) {
      name
      login
      id
    }
  }
}

fragment Avatar_gitHub_1Os64M on GitHubQuery {
  viewer {
    login
    avatarUrl(size: 96)
    id
  }
  repository(name: $repoName, owner: $repoOwner) {
    viewerPermission
    viewerCanAdminister
    id
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

fragment Comments_post on GitHubIssue {
  comments(first: 100) {
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
      avatarUrl(size: 96)
      url
      twitterUsername
      websiteUrl
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
        isViewer
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
      avatarUrl(size: 96)
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
  },
  {
    "kind": "LocalArgument",
    "name": "subdomain",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
  "name": "url",
  "args": null,
  "storageKey": null
},
v5 = [
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
v6 = [
  {
    "kind": "Variable",
    "name": "number",
    "variableName": "issueNumber"
  }
],
v7 = [
  (v2/*: any*/)
],
v8 = {
  "kind": "InlineFragment",
  "type": "GitHubUser",
  "selections": (v7/*: any*/)
},
v9 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "number",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "body",
  "args": null,
  "storageKey": null
},
v14 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "subdomain"
  }
],
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarHandle",
  "alias": null,
  "name": "body",
  "args": null,
  "handle": "registerMarkdown",
  "key": "",
  "filters": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "createdAt",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v19 = {
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
        (v18/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "nodes",
          "storageKey": null,
          "args": null,
          "concreteType": "GitHubUser",
          "plural": true,
          "selections": [
            (v1/*: any*/),
            (v2/*: any*/),
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "isViewer",
              "args": null,
              "storageKey": null
            },
            (v11/*: any*/)
          ]
        }
      ]
    }
  ]
},
v20 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PostRoot_PostQuery",
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
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "repository",
            "storageKey": null,
            "args": (v5/*: any*/),
            "concreteType": "GitHubRepository",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issue",
                "storageKey": null,
                "args": (v6/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "author",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v8/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "labels",
                    "storageKey": "labels(first:100)",
                    "args": (v9/*: any*/),
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
                        "selections": (v7/*: any*/)
                      }
                    ]
                  },
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
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
          },
          {
            "kind": "LinkedField",
            "alias": "subdomainAuthor",
            "name": "user",
            "storageKey": null,
            "args": (v14/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v1/*: any*/)
            ]
          },
          {
            "kind": "FragmentSpread",
            "name": "Avatar_gitHub",
            "args": [
              {
                "kind": "Variable",
                "name": "repoName",
                "variableName": "repoName"
              },
              {
                "kind": "Variable",
                "name": "repoOwner",
                "variableName": "repoOwner"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PostRoot_PostQuery",
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
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v11/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "repository",
            "storageKey": null,
            "args": (v5/*: any*/),
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
              },
              (v11/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issue",
                "storageKey": null,
                "args": (v6/*: any*/),
                "concreteType": "GitHubIssue",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "author",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v15/*: any*/),
                      (v1/*: any*/),
                      (v8/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "labels",
                    "storageKey": "labels(first:100)",
                    "args": (v9/*: any*/),
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
                          (v2/*: any*/),
                          (v11/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
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
                          (v11/*: any*/),
                          (v2/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
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
                  (v19/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "commentsCount",
                    "name": "comments",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubIssueCommentConnection",
                    "plural": false,
                    "selections": [
                      (v18/*: any*/)
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
                      (v2/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "owner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v15/*: any*/),
                          (v1/*: any*/),
                          (v3/*: any*/),
                          (v11/*: any*/)
                        ]
                      },
                      (v11/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "comments",
                    "storageKey": "comments(first:100)",
                    "args": (v9/*: any*/),
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
                              (v11/*: any*/),
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "author",
                                "storageKey": null,
                                "args": null,
                                "concreteType": null,
                                "plural": false,
                                "selections": [
                                  (v15/*: any*/),
                                  (v1/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubUser",
                                    "selections": (v20/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubBot",
                                    "selections": [
                                      (v3/*: any*/),
                                      (v4/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubOrganization",
                                    "selections": (v20/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubMannequin",
                                    "selections": [
                                      (v11/*: any*/),
                                      (v4/*: any*/)
                                    ]
                                  }
                                ]
                              },
                              (v13/*: any*/),
                              (v16/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "createdViaEmail",
                                "args": null,
                                "storageKey": null
                              },
                              (v17/*: any*/),
                              (v19/*: any*/),
                              (v15/*: any*/)
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
                    "args": (v9/*: any*/),
                    "handle": "connection",
                    "key": "Comments_post_comments",
                    "filters": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "subdomainAuthor",
            "name": "user",
            "storageKey": null,
            "args": (v14/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v1/*: any*/),
              (v11/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PostRoot_PostQuery",
    "id": "1ea94d43-6a25-45ea-a60f-97075ae1309e",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd49ada898d0c6f28d801a5b1f0de9b7f';
module.exports = node;
