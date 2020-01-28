// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {
  commitMutation,
  createPaginationContainer,
  type RelayProp,
} from 'react-relay';
import {useRelayEnvironment} from 'react-relay/hooks';
import {ConnectionHandler} from 'relay-runtime';
import {PostBox, ReactionBar} from './Post';
import type {Comments_post} from './__generated__/Comments_post.graphql';
import LoadingSpinner from './loadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Text} from 'grommet/components/Text';
import {TextArea} from 'grommet/components/TextArea';
import {Tabs} from 'grommet/components/Tabs';
import {Tab} from 'grommet/components/Tab';
import {Button} from 'grommet/components/Button';
import {Stack} from 'grommet/components/Stack';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import Comment from './Comment';
import {NotificationContext} from './Notifications';
import UserContext from './UserContext';
import GitHubLoginButton from './GitHubLoginButton';

type Props = {
  relay: RelayProp,
  post: Comments_post,
  postId: string,
  viewer: {login: string, name: string, avatarUrl: string, url: string},
};

// n.b. no accessToken in the persistedQueryConfiguration for this mutation,
// because we want to add comments on behalf of the logged-in user, not the
// persisted auth
const addCommentMutation = graphql`
  mutation Comments_AddCommentMutation($input: GitHubAddCommentInput!)
    @persistedQueryConfiguration(freeVariables: ["input"]) {
    gitHub {
      addComment(input: $input) {
        commentEdge {
          node {
            ...Comment_comment
          }
        }
      }
    }
  }
`;

let tempId = 0;

function CommentInput({
  postId,
  viewer,
}: {
  postId: string,
  viewer: {login: string, avatarUrl: string, name: string, url: string},
}) {
  const environment = useRelayEnvironment();
  const {error: notifyError} = React.useContext(NotificationContext);
  const {loginStatus, login} = React.useContext(UserContext);

  const isLoggedIn = loginStatus === 'logged-in';

  const [comment, setComment] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const saveComment = () => {
    setSaving(true);
    const updater = (store, data) => {
      const newComment = store.get(
        data.gitHub.addComment.commentEdge.node.__id,
      );
      const post = store.get(postId);
      const ch = ConnectionHandler;
      const comments = ConnectionHandler.getConnection(
        post,
        'Comments_post_comments',
      );
      const edge = ConnectionHandler.createEdge(
        store,
        comments,
        newComment,
        'GitHubIssueComment',
      );
      ConnectionHandler.insertEdgeAfter(comments, edge);
    };
    commitMutation(environment, {
      mutation: addCommentMutation,
      variables: {
        input: {
          body: comment,
          subjectId: postId,
        },
      },
      onCompleted: () => {
        setSaving(false);
        setComment('');
      },
      onError: err => {
        notifyError('Error saving comment. Please try again.');
        setSaving(false);
      },
      optimisticResponse: {
        gitHub: {
          addComment: {
            commentEdge: {
              node: {
                id: `client:newComment:${tempId++}`,
                body: comment,
                createdViaEmail: false,
                author: {
                  __typename: 'GitHubUser',
                  name: viewer.name,
                  avatarUrl: viewer.avatarUrl,
                  login: viewer.login,
                  url: viewer.url,
                },
                createdAt: new Date().toString(),
                reactionGroups: [],
              },
            },
          },
        },
      },
      optimisticUpdater: updater,
      updater: updater,
    });
  };

  return (
    <PostBox>
      <Stack
        guidingChild="first"
        interactiveChild={isLoggedIn ? 'first' : 'last'}
        anchor="center">
        <Box style={{opacity: isLoggedIn ? 1 : 0.3}}>
          <Tabs justify="start">
            <Tab title={<Text size="small">Write</Text>}>
              <Box pad="small" height="small">
                <TextArea
                  disabled={saving}
                  placeholder="Leave a comment (supports markdown)"
                  value={comment}
                  style={{height: '100%', fontWeight: 'normal'}}
                  onChange={e => setComment(e.target.value)}
                />
              </Box>
            </Tab>
            <Tab title={<Text size="small">Preview</Text>}>
              <Box pad="small" height={{min: 'small'}}>
                <MarkdownRenderer
                  escapeHtml={true}
                  source={comment.trim() ? comment : 'Nothing to preview.'}
                />
              </Box>
            </Tab>
          </Tabs>
          <Box>
            <Box pad="small" align="end">
              <Button
                fill={false}
                label="Comment"
                onClick={saveComment}
                disabled={saving}
              />
            </Box>
          </Box>
        </Box>
        <Box style={{visibility: isLoggedIn ? 'hidden' : 'visible'}}>
          <GitHubLoginButton onClick={login} label="Log in with GitHub" />
        </Box>
      </Stack>
    </PostBox>
  );
}

function Comments({post, relay, postId, viewer}: Props) {
  const comments = [];
  for (const edge of post.comments.edges || []) {
    if (edge && edge.node) {
      comments.push(edge.node);
    }
  }

  return (
    <Box id="comments">
      {comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
      <CommentInput viewer={viewer} postId={postId} />
      <Box height="xsmall" />
    </Box>
  );
}

export default createPaginationContainer(
  Comments,
  {
    post: graphql`
      fragment Comments_post on GitHubIssue
        @argumentDefinitions(
          count: {type: "Int", defaultValue: 100}
          cursor: {type: "String"}
        ) {
        comments(first: $count, after: $cursor)
          @connection(key: "Comments_post_comments") {
          edges {
            node {
              id
              ...Comment_comment
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.comments;
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count: count,
        cursor,
        // XXX: fix
        issueNumber: props.issue.number,
      };
    },
    query: graphql`
      # repoName and repoOwner provided by fixedVariables
      query CommentsPaginationQuery(
        $count: Int!
        $cursor: String
        $issueNumber: Int!
        $repoName: String!
        $repoOwner: String!
      )
        @persistedQueryConfiguration(
          accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
          freeVariables: ["count", "cursor", "issueNumber"]
          fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
          cacheSeconds: 300
        ) {
        gitHub {
          repository(name: $repoName, owner: $repoOwner) {
            __typename
            issue(number: $issueNumber) {
              ...Comments_post @arguments(count: $count, cursor: $cursor)
            }
          }
        }
      }
    `,
  },
);
