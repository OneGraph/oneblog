// @flow

import * as React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {
  createFragmentContainer,
  commitMutation,
  fetchQuery,
  type RelayProp,
} from 'react-relay';
import MarkdownRenderer from './MarkdownRenderer';
import formatDate from 'date-fns/format';
import EmojiIcon from './emojiIcon';
import AddIcon from './addIcon';
import Tippy from '@tippy.js/react';
import 'tippy.js/themes/light-border.css';
import {Link} from 'react-router-dom';
import {postRootQuery} from './App';
import GitHubLoginButton from './GitHubLoginButton';
import {NotificationContext} from './Notifications';
import {Box, Heading, Text} from 'grommet';
import UserContext from './UserContext';

import type {Post_post} from './__generated__/Post_post.graphql';

const addReactionMutation = graphql`
  mutation Post_AddReactionMutation($input: GitHubAddReactionInput!) {
    gitHub {
      addReaction(input: $input) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  }
`;

const removeReactionMutation = graphql`
  mutation Post_RemoveReactionMutation($input: GitHubRemoveReactionInput!) {
    gitHub {
      removeReaction(input: $input) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  }
`;

function reactionUpdater({store, viewerHasReacted, postId, content}) {
  const reactionGroup = store
    .get(postId)
    .getLinkedRecords('reactionGroups')
    .find(r => r.getValue('content') === content);
  reactionGroup.setValue(viewerHasReacted, 'viewerHasReacted');
  const users = reactionGroup.getLinkedRecord('users');
  users.setValue(
    Math.max(0, users.getValue('totalCount') + (viewerHasReacted ? 1 : -1)),
    'totalCount',
  );
}

async function addReaction({environment, content, postId}) {
  const variables = {
    input: {
      content,
      subjectId: postId,
    },
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: addReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({response, errors}),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({store, viewerHasReacted: true, content, postId}),
      updater: (store, data) =>
        reactionUpdater({store, viewerHasReacted: true, content, postId}),
    });
  });
}

async function removeReaction({environment, content, postId}) {
  const variables = {
    input: {
      content,
      subjectId: postId,
    },
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: removeReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({response, errors}),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({store, viewerHasReacted: false, content, postId}),
      updater: (store, data) =>
        reactionUpdater({store, viewerHasReacted: false, content, postId}),
    });
  });
}

function emojiForContent(content) {
  switch (content) {
    case 'THUMBS_UP':
      return '👍';
    case 'THUMBS_DOWN':
      return '👎';
    case 'LAUGH':
      return '😄';
    case 'HOORAY':
      return '🎉';
    case 'CONFUSED':
      return '😕';
    case 'HEART':
      return '❤️';
    case 'ROCKET':
      return '🚀';
    case 'EYES':
      return '👀';
    default:
      return null;
  }
}

const reactions = [
  'THUMBS_UP',
  'THUMBS_DOWN',
  'LAUGH',
  'HOORAY',
  'CONFUSED',
  'HEART',
  'ROCKET',
  'EYES',
];

const EmojiPicker = ({
  viewerReactions,
  onSelect,
  onDeselect,
  isLoggedIn,
  login,
}) => {
  const reactionContent = reaction => {
    const isSelected = viewerReactions.includes(reaction);
    return (
      <button
        style={{
          cursor: 'pointer',
          outline: 'none',
          fontSize: 20,
          padding: '0 5px',
          backgroundColor: isSelected ? '#ddefff' : 'transparent',
          border: isSelected ? '1px solid #e1e4e8' : '1px solid transparent',
        }}
        key={reaction}
        onClick={() =>
          isSelected ? onDeselect(reaction) : onSelect(reaction)
        }>
        <span role="img">{emojiForContent(reaction)}</span>
      </button>
    );
  };
  return (
    <>
      <p style={{textAlign: 'left', margin: '5px 0 0'}}>Pick your reaction</p>
      <div style={{height: 1, background: '#ddd', margin: '5px 0'}} />
      {isLoggedIn ? (
        <>
          <div>
            {reactions.slice(0, 4).map(reaction => reactionContent(reaction))}
          </div>
          <div>
            {reactions.slice(4).map(reaction => reactionContent(reaction))}
          </div>
        </>
      ) : (
        <GitHubLoginButton onClick={login} />
      )}
    </>
  );
};

type Props = {
  relay: RelayProp,
  post: Post_post,
};

function PostBox({children}: {children: React.Node}) {
  return (
    <Box
      margin="medium"
      style={{
        maxWidth: 704,
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0,0,0,0.2)',
      }}>
      {children}
    </Box>
  );
}

const Post = ({relay, post}: Props) => {
  const {error: notifyError} = React.useContext(NotificationContext);
  const [showReactionPopover, setShowReactionPopover] = React.useState(false);
  const popoverInstance = React.useRef();
  const {isLoggedIn, login} = React.useContext(UserContext);

  const usedReactions = (post.reactionGroups || []).filter(
    g => g.users.totalCount > 0,
  );
  const authors = post.assignees.nodes || [];
  return (
    <PostBox>
      <Box pad="medium">
        <Heading level={3} margin="none">
          <Link
            style={{color: 'inherit'}}
            to={`/post/${post.number}`}
            onMouseOver={() =>
              fetchQuery(relay.environment, postRootQuery, {
                issueNumber: post.number,
              })
            }>
            {post.title}
          </Link>
        </Heading>

        <Text size="xsmall">
          {formatDate(new Date(post.createdAt), 'MMM Do, YYYY')}
        </Text>
        <Text size="small">
          <MarkdownRenderer source={post.body} />
        </Text>
      </Box>
      {authors.length > 0 ? (
        //style={{ borderTop: "1px solid rgba(0,0,0,0.12)", padding: 16 }}>
        <Box
          pad="medium"
          border={{size: 'xsmall', side: 'top', color: 'rgba(0,0,0,0.1)'}}>
          {authors.map(node =>
            node ? (
              <Box key={node.id} align="center" direction="row">
                <img
                  alt={node.name}
                  src={node.avatarUrl}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    marginRight: 8,
                  }}
                />
                <Text size="small">{node.name}</Text>
              </Box>
            ) : null,
          )}
        </Box>
      ) : null}
      <Box
        pad="xsmall"
        direction="row"
        wrap={true}
        border={{size: 'xsmall', side: 'top', color: 'rgba(0,0,0,0.1)'}}>
        {usedReactions.map(g => (
          <Text
            key={g.content}
            style={{
              padding: '0 16px',
              borderRight: '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
            }}>
            {emojiForContent(g.content)}{' '}
            <Text size="small" style={{marginLeft: 8}}>
              {g.users.totalCount}
            </Text>
          </Text>
        ))}
        <Tippy
          onCreate={instance => (popoverInstance.current = instance)}
          arrow={true}
          trigger="click"
          theme="light-border"
          inertia={true}
          interactive={true}
          animateFill={false}
          interactiveBorder={10}
          duration={[300, 75]}
          content={
            <div>
              <EmojiPicker
                isLoggedIn={isLoggedIn}
                login={login}
                viewerReactions={usedReactions
                  .filter(x => x.viewerHasReacted)
                  .map(x => x.content)}
                onDeselect={async content => {
                  popoverInstance.current && popoverInstance.current.hide();
                  try {
                    await removeReaction({
                      environment: relay.environment,
                      content,
                      postId: post.id,
                    });
                  } catch (e) {
                    notifyError('Error removing reaction.');
                  }
                }}
                onSelect={async content => {
                  popoverInstance.current && popoverInstance.current.hide();
                  try {
                    await addReaction({
                      environment: relay.environment,
                      content,
                      postId: post.id,
                    });
                  } catch (e) {
                    notifyError('Error adding reaction.');
                  }
                }}
              />
            </div>
          }>
          <span
            style={{padding: '8px 16px'}}
            className="add-reaction-emoji"
            onClick={() => setShowReactionPopover(!showReactionPopover)}>
            <AddIcon width="12" />
            <EmojiIcon width="24" style={{stroke: 'rgba(0,0,0,0)'}} />
          </span>
        </Tippy>
      </Box>
    </PostBox>
  );
};

export default createFragmentContainer(Post, {
  post: graphql`
    fragment Post_post on GitHubIssue {
      id
      number
      title
      body
      createdAt
      author {
        login
        avatarUrl
      }
      updatedAt
      assignees(first: 10) {
        nodes {
          id
          name
          login
          avatarUrl
        }
      }
      reactionGroups {
        content
        viewerHasReacted
        users {
          totalCount
        }
      }
      comments {
        totalCount
      }
    }
  `,
});

const WORDS = [
  'people',
  'see',
  'one',
  'make',
  'day',
  'it’s',
  'man',
  'old',
  'out',
  'dog',
  'guy',
  'new',
  'video',
  'things',
  'life',
  'made',
  'year',
  'never',
  'facebook',
  'awesome',
  'girl',
  'look',
  'photos',
  'love',
  'know',
  'best',
  'way',
  'thing',
  'beautiful',
  'time',
  'little',
  'more',
  'first',
  'happened',
  'heart',
  'now',
  'you’ll',
  'being',
  'ways',
  'want',
  'think',
  'something',
  'years',
  'found',
  'better',
  'seen',
  'baby',
  'really',
  'world',
  'actually',
  'valentine’s',
  'down',
  'reasons',
  'watch',
  'need',
  'here',
  'good',
  'media',
  'makes',
  'boy',
  'mind',
  'right',
  'social',
];

function blockWord(size: number): string {
  let res = '';
  for (let i = 0; i < size; i++) {
    res += '█';
  }
  return res;
}

function randInt(x: number): number {
  return Math.floor(Math.random() * x);
}

function randomWord() {
  // return WORDS[randInt(WORDS.length)];
  return blockWord(randInt(4) + 1);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class LoadingPost extends React.PureComponent<*, *> {
  render() {
    return (
      <PostBox>
        <Box pad="medium" style={{opacity: '0.6'}} className="shimmer">
          <Heading level={3} margin="none">
            ██ ██ ██
          </Heading>
          <Text size="xsmall">█ █ ██</Text>
          <Text size="small">
            <MarkdownRenderer
              source={`█ ██ █ █ ██ ██ █ ██ ██ ██ ██ █ █ ██ █ ██ █ ██ █ █ █ █ ██ ██ ██ ██ █ █ ██ █ ██ ██ █ █ ██ █ █ █ ██ █ ██ █ ██ ██ ██ █ ██ ██ █ ██ ██ █ █ ██ █ █ ██ ██ ██ █ █ ██ █ █ █ █ █ █ ██ ██ █ ██ ██ █ ██ ██ ██ ██ █ ██ █ █ █ ██ █ █ ██ ██ ██ ██ █ █ ██ █ █ ██ █ ██ █ █ ██ ██ █ █ █ █ ██ █ ██ █ ██ █ █ █ ██ ██ █ █ █ █ ██ ██

██ ██ ██ █ █ █ █ █ ██ ██ ██ █ ██ ██ ██ ██ █ ██ █ █ █ █ ██ █ ██ █ █ █ █ █ █ █ ██ ██ █ █ █ █ █ █ ██ ██ █ █ ██ ██ ██ █ ██ ██ █ █ █ ██ █ █ █ ██ █ █ ██ ██ █ █ █ ██ ██ █ █ █ █ ██ ██ ██ ██ █ █ ██ ██ ██ █ █ █ █ █ █ ██ █ ██ █ █ ██ █ █ █ █ █ ██ █ ██ ██ ██ ██ █ ██ ██ ██ █ █ █ ██ █ ██ █ ██ █ ██ █ ██ ██ ██ █ █ ██ ██ █ ██ ██ ██ ██ █ ██ █ █ ██ ██ █ ██ ██ █ ██ █ █ ██ █ █ ██ █ █ █ ██ █ ██ █ ██ █ █ █ █ █ ██ █ █ ██ █ ██ ██ ██ █ █ █ ██ █ ██ ██ ██ █ ██ █ █ ██ ██ ██ █ █ █ █ ██ ██ █ ██ ██ █ ██ ██ ██ █ ██ █

██ █ █ █ ██ ██ ██ █ ██ ██ ██ ██ █ ██ ██ ██ ██ █ ██ ██ █ ██ █ ██ ██ ██ ██ ██ ██ ██ █ ██ ██ █ ██ ██ ██ ██ ██ █ █ ██ ██ █ █ ██ █ ██ █ ██ █ ██ █ █ ██ ██ █ ██ ██ █ ██ ██ █ ██ █ ██ ██ ██ █ █ █ ██ ██ ██ ██ ██ ██ █ █ ██ █ ██ █ ██ █ ██ █ ██ █ █ ██ ██ ██ ██ ██ ██ ██ █ █ █ █ ██ █ █ █ █ █ █ ██ █ █ ██ █ █ ██ █ ██ █ ██ ██ ██ █ █ █ █ █ ██ ██ █ █ ██ █ █ █ █ ██ ██ █ █`}
            />
          </Text>
        </Box>
      </PostBox>
    );
  }
}
