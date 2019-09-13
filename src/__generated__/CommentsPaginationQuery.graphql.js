/**
 * @flow
 * @relayHash ec2feaff9d502683cc1e5fe88325467a
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
) @persistedQueryConfiguration(accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}) {
  gitHub {
    repository(name: "onegraph-changelog", owner: "onegraph") {
      __typename
      issue(number: $issueNumber) {
        ...Comments_post_1G22uz
        id
      }
      id
    }
  }
}

fragment Comments_post_1G22uz on GitHubIssue {
  comments(first: $count, after: $cursor) {
    edges {
      node {
        ...Comment_comment
        id
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
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "name",
    "value": "onegraph-changelog"
  },
  {
    "kind": "Literal",
    "name": "owner",
    "value": "onegraph"
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
  "name": "avatarUrl",
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
  "name": "url",
  "args": null,
  "storageKey": null
},
v9 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/),
  (v5/*: any*/)
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
            "storageKey": "repository(name:\"onegraph-changelog\",owner:\"onegraph\")",
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
            "storageKey": "repository(name:\"onegraph-changelog\",owner:\"onegraph\")",
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
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "body",
                                "args": null,
                                "storageKey": null
                              },
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
                                  (v2/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubUser",
                                    "selections": (v9/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubBot",
                                    "selections": [
                                      (v6/*: any*/),
                                      (v7/*: any*/),
                                      (v8/*: any*/),
                                      (v5/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubOrganization",
                                    "selections": (v9/*: any*/)
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "GitHubMannequin",
                                    "selections": [
                                      (v5/*: any*/),
                                      (v7/*: any*/),
                                      (v8/*: any*/)
                                    ]
                                  }
                                ]
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
                                          (v7/*: any*/),
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
    "id": "f999d707-223e-4188-8321-9359ca6b8f6a",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2e47244b4c63461a5eaa8aa0d8f732e6';
module.exports = node;
