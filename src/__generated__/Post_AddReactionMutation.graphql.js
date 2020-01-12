/**
 * @flow
 * @relayHash 73c3dd9f9a993b69abf905d595c9c94a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Comment_comment$ref = any;
type Post_post$ref = any;
export type GitHubReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type GitHubAddReactionInput = {|
  clientMutationId?: ?string,
  content: GitHubReactionContent,
  subjectId: string,
|};
export type Post_AddReactionMutationVariables = {|
  input: GitHubAddReactionInput
|};
export type Post_AddReactionMutationResponse = {|
  +gitHub: ?{|
    +addReaction: ?{|
      +reaction: ?{|
        +content: GitHubReactionContent,
        +user: ?{|
          +login: string,
          +name: ?string,
        |},
        +reactable: {|
          +$fragmentRefs: Comment_comment$ref & Post_post$ref
        |},
      |}
    |}
  |}
|};
export type Post_AddReactionMutation = {|
  variables: Post_AddReactionMutationVariables,
  response: Post_AddReactionMutationResponse,
|};
*/


/*
mutation Post_AddReactionMutation(
  $input: GitHubAddReactionInput!
) @persistedQueryConfiguration(freeVariables: ["input"]) {
  gitHub {
    addReaction(input: $input) {
      reaction {
        content
        user {
          login
          name
          id
        }
        reactable {
          __typename
          ... on GitHubIssue {
            ...Post_post
          }
          ... on GitHubComment {
            ...Comment_comment
          }
          id
        }
        id
      }
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
    "name": "input",
    "type": "GitHubAddReactionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "content",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "login",
  "args": null,
  "storageKey": null
},
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
v6 = [
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "body",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "createdAt",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "totalCount",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "reactionGroups",
  "storageKey": null,
  "args": null,
  "concreteType": "GitHubReactionGroup",
  "plural": true,
  "selections": [
    (v2/*: any*/),
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
        (v12/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "nodes",
          "storageKey": null,
          "args": null,
          "concreteType": "GitHubUser",
          "plural": true,
          "selections": (v6/*: any*/)
        }
      ]
    }
  ]
},
v14 = [
  (v4/*: any*/),
  (v10/*: any*/),
  (v3/*: any*/),
  (v11/*: any*/),
  (v5/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Post_AddReactionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "addReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddReactionPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "reaction",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubReaction",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "user",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubUser",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "reactable",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      {
                        "kind": "InlineFragment",
                        "type": "GitHubIssue",
                        "selections": [
                          {
                            "kind": "FragmentSpread",
                            "name": "Post_post",
                            "args": null
                          }
                        ]
                      },
                      {
                        "kind": "FragmentSpread",
                        "name": "Comment_comment",
                        "args": null
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
    "name": "Post_AddReactionMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "gitHub",
        "storageKey": null,
        "args": null,
        "concreteType": "GitHubMutation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "addReaction",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddReactionPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "reaction",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubReaction",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "user",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "GitHubUser",
                    "plural": false,
                    "selections": (v6/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "reactable",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "GitHubIssue",
                        "selections": [
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
                          (v8/*: any*/),
                          (v9/*: any*/),
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
                                  (v3/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/)
                                ]
                              }
                            ]
                          },
                          (v13/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": "commentsCount",
                            "name": "comments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "GitHubIssueCommentConnection",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/)
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
                                  (v7/*: any*/),
                                  (v3/*: any*/),
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
                          }
                        ]
                      },
                      {
                        "kind": "InlineFragment",
                        "type": "GitHubIssueComment",
                        "selections": [
                          (v8/*: any*/),
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
                              (v7/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "GitHubUser",
                                "selections": (v14/*: any*/)
                              },
                              {
                                "kind": "InlineFragment",
                                "type": "GitHubBot",
                                "selections": [
                                  (v10/*: any*/),
                                  (v3/*: any*/),
                                  (v11/*: any*/),
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
                                  (v3/*: any*/),
                                  (v11/*: any*/)
                                ]
                              }
                            ]
                          },
                          (v9/*: any*/),
                          (v13/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v5/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "Post_AddReactionMutation",
    "id": "d3aabbf7-81d9-41d5-8020-db38624426c0",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c509fb5a28dff4ee23315a215532135f';
module.exports = node;
