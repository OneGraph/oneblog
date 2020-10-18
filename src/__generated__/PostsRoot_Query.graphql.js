/**
 * @flow
 * @relayHash f0c4c6c693ab070af762525d80b648fc
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Avatar_gitHub$ref = any;
type Posts_repository$ref = any;
export type PostsRoot_QueryVariables = {|
  repoName: string,
  repoOwner: string,
  subdomain: string,
|};
export type PostsRoot_QueryResponse = {|
  +gitHub: ?{|
    +repository: ?{|
      +$fragmentRefs: Posts_repository$ref
    |},
    +subdomainAuthor: ?{|
      +name: ?string,
      +login: string,
    |},
    +$fragmentRefs: Avatar_gitHub$ref,
  |}
|};
export type PostsRoot_Query = {|
  variables: PostsRoot_QueryVariables,
  response: PostsRoot_QueryResponse,
|};
*/


/*
query PostsRoot_Query(
  $repoName: String!
  $repoOwner: String!
  $subdomain: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, freeVariables: ["subdomain"], cacheSeconds: 300) {
  gitHub {
    ...Avatar_gitHub_1Os64M
    repository(name: $repoName, owner: $repoOwner) {
      ...Posts_repository_2slgxN
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

fragment Posts_repository_2slgxN on GitHubRepository {
  issues(first: 10, orderBy: {direction: DESC, field: CREATED_AT}, filterBy: {createdBy: $subdomain, labels: ["publish", "Publish"]}) {
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
  },
  {
    "kind": "LocalArgument",
    "name": "subdomain",
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
    "name": "login",
    "variableName": "subdomain"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v5 = {
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
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v8 = [
  {
    "kind": "ObjectValue",
    "name": "filterBy",
    "fields": [
      {
        "kind": "Variable",
        "name": "createdBy",
        "variableName": "subdomain"
      },
      {
        "kind": "Literal",
        "name": "labels",
        "value": [
          "publish",
          "Publish"
        ]
      }
    ]
  },
  (v7/*: any*/),
  {
    "kind": "Literal",
    "name": "orderBy",
    "value": {
      "direction": "DESC",
      "field": "CREATED_AT"
    }
  }
],
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v10 = {
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
    "name": "PostsRoot_Query",
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
                "args": [
                  {
                    "kind": "Variable",
                    "name": "author",
                    "variableName": "subdomain"
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
            "args": (v2/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
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
    "name": "PostsRoot_Query",
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
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/)
            ]
          },
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
              (v6/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "issues",
                "storageKey": null,
                "args": (v8/*: any*/),
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
                          (v6/*: any*/),
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
                              (v7/*: any*/)
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
                                  (v6/*: any*/),
                                  (v3/*: any*/),
                                  (v4/*: any*/),
                                  (v5/*: any*/),
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
                                  (v9/*: any*/),
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
                                      (v3/*: any*/),
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "isViewer",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v6/*: any*/)
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
                              (v9/*: any*/)
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
                              (v3/*: any*/),
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
                                  (v4/*: any*/),
                                  (v5/*: any*/),
                                  (v6/*: any*/)
                                ]
                              },
                              (v6/*: any*/)
                            ]
                          },
                          (v10/*: any*/)
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
                  },
                  {
                    "kind": "ClientExtension",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isClientFetched",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarHandle",
                        "alias": null,
                        "name": "isClientFetched",
                        "args": null,
                        "handle": "isClientFetched",
                        "key": "",
                        "filters": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "issues",
                "args": (v8/*: any*/),
                "handle": "connection",
                "key": "Posts_posts_issues",
                "filters": [
                  "orderBy",
                  "filterBy"
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "subdomainAuthor",
            "name": "user",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v6/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PostsRoot_Query",
    "id": "733c5103-df37-4fd9-996a-0ac4156f22e5",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '42f742e7b0eedd092d12de39d70c6ccb';
module.exports = node;
