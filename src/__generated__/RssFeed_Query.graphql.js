/**
 * @flow
 * @relayHash fb5ece2cae33139a8ee019494e5f08c5
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type RssFeed_QueryVariables = {|
  repoOwner: string,
  repoName: string,
  subdomain: string,
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
          +createdAt: any,
          +updatedAt: any,
          +assignees: {|
            +nodes: ?$ReadOnlyArray<?{|
              +id: string,
              +name: ?string,
              +login: string,
              +avatarUrl: any,
              +url: any,
              +twitterUsername: ?string,
              +websiteUrl: ?any,
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
                +isViewer: boolean,
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
              +avatarUrl: any,
            |},
          |},
        |}>
      |}
    |},
    +subdomainAuthor: ?{|
      +name: ?string,
      +login: string,
    |},
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
  $subdomain: String!
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}, freeVariables: ["subdomain"], fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}, cacheSeconds: 300) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issues(first: 20, orderBy: {direction: DESC, field: CREATED_AT}, filterBy: {createdBy: $subdomain, labels: ["publish", "Publish"]}) {
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
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
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
  "name": "createdAt",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "updatedAt",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
v10 = {
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
        (v8/*: any*/),
        (v9/*: any*/),
        (v10/*: any*/),
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
  "kind": "ScalarField",
  "alias": null,
  "name": "isViewer",
  "args": null,
  "storageKey": null
},
v17 = {
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
v18 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "subdomain"
  }
];
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
                "storageKey": null,
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
                      {
                        "kind": "ScalarField",
                        "alias": "body",
                        "name": "__body_registerMarkdown",
                        "args": null,
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      (v7/*: any*/),
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
                                  (v9/*: any*/),
                                  (v8/*: any*/),
                                  (v16/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v17/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "repository",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubRepository",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "owner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v10/*: any*/)
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
          {
            "kind": "LinkedField",
            "alias": "subdomainAuthor",
            "name": "user",
            "storageKey": null,
            "args": (v18/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v9/*: any*/)
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
                "storageKey": null,
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
                      (v6/*: any*/),
                      (v7/*: any*/),
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
                                  (v9/*: any*/),
                                  (v8/*: any*/),
                                  (v16/*: any*/),
                                  (v3/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v17/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "repository",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "GitHubRepository",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/),
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
                              (v9/*: any*/),
                              (v10/*: any*/),
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
          },
          {
            "kind": "LinkedField",
            "alias": "subdomainAuthor",
            "name": "user",
            "storageKey": null,
            "args": (v18/*: any*/),
            "concreteType": "GitHubUser",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              (v9/*: any*/),
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
    "id": "c3ae4dab-284d-48e6-a907-b85fd078cc8f",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7a57e73956d8d1cde8b7562860e82649';
module.exports = node;
