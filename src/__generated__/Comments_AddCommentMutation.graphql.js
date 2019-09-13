/**
 * @flow
 * @relayHash bf9e3bbc00dd41ba5288df60f6e9994d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Comment_comment$ref = any;
export type GitHubAddCommentInput = {|
  clientMutationId?: ?string,
  body: string,
  subjectId: string,
|};
export type Comments_AddCommentMutationVariables = {|
  input: GitHubAddCommentInput
|};
export type Comments_AddCommentMutationResponse = {|
  +gitHub: ?{|
    +addComment: ?{|
      +commentEdge: ?{|
        +node: ?{|
          +$fragmentRefs: Comment_comment$ref
        |}
      |}
    |}
  |}
|};
export type Comments_AddCommentMutation = {|
  variables: Comments_AddCommentMutationVariables,
  response: Comments_AddCommentMutationResponse,
|};
*/


/*
mutation Comments_AddCommentMutation(
  $input: GitHubAddCommentInput!
) {
  gitHub {
    addComment(input: $input) {
      commentEdge {
        node {
          ...Comment_comment
          id
        }
      }
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
    "name": "input",
    "type": "GitHubAddCommentInput!",
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "avatarUrl",
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
  "name": "url",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  (v2/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Comments_AddCommentMutation",
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
            "name": "addComment",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddCommentPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "commentEdge",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubIssueCommentEdge",
                "plural": false,
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
    "name": "Comments_AddCommentMutation",
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
            "name": "addComment",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "GitHubAddCommentPayload",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "commentEdge",
                "storageKey": null,
                "args": null,
                "concreteType": "GitHubIssueCommentEdge",
                "plural": false,
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
                      (v2/*: any*/),
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "__typename",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "GitHubUser",
                            "selections": (v6/*: any*/)
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "GitHubBot",
                            "selections": [
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v2/*: any*/)
                            ]
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "GitHubOrganization",
                            "selections": (v6/*: any*/)
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "GitHubMannequin",
                            "selections": [
                              (v2/*: any*/),
                              (v4/*: any*/),
                              (v5/*: any*/)
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
                                  (v4/*: any*/),
                                  (v2/*: any*/)
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
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "Comments_AddCommentMutation",
    "id": "13ad39dc-4162-435f-9a1d-72f147bd12ef",
    "text": null,
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '73974aeacbfb70c174c24c15570d895f';
module.exports = node;
