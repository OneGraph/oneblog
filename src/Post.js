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
import Tippy, {TippyGroup} from '@tippy.js/react';
import 'tippy.js/themes/light-border.css';
import Link from './PreloadLink';
import {postRootQuery} from './App';
import GitHubLoginButton from './GitHubLoginButton';
import {NotificationContext} from './Notifications';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Text} from 'grommet/components/Text';
import UserContext from './UserContext';
import {lowerCase} from 'lower-case';
import {sentenceCase} from 'sentence-case';
import unified from 'unified';
import parse from 'remark-parse';
import imageUrl from './imageUrl';
import {Helmet} from 'react-helmet';

import type {Post_post} from './__generated__/Post_post.graphql';

// n.b. no accessToken in the persistedQueryConfiguration for these mutations,
// because we want to add reactions on behalf of the logged-in user, not the
// persisted auth
const addReactionMutation = graphql`
  mutation Post_AddReactionMutation($input: GitHubAddReactionInput!)
    @persistedQueryConfiguration(freeVariables: ["input"]) {
    gitHub {
      addReaction(input: $input) {
        reaction {
          content
          user {
            login
            name
          }
          reactable {
            ... on GitHubIssue {
              ...Post_post
            }
            ... on GitHubComment {
              ...Comment_comment
            }
          }
        }
      }
    }
  }
`;

const removeReactionMutation = graphql`
  mutation Post_RemoveReactionMutation($input: GitHubRemoveReactionInput!)
    @persistedQueryConfiguration(freeVariables: ["input"]) {
    gitHub {
      removeReaction(input: $input) {
        reaction {
          content
          user {
            login
            name
          }
          reactable {
            ... on GitHubIssue {
              ...Post_post
            }
            ... on GitHubComment {
              ...Comment_comment
            }
          }
        }
      }
    }
  }
`;

function reactionUpdater({store, viewerHasReacted, subjectId, content}) {
  const reactionGroup = store
    .get(subjectId)
    .getLinkedRecords('reactionGroups')
    .find(r => r.getValue('content') === content);
  reactionGroup.setValue(viewerHasReacted, 'viewerHasReacted');
  const users = reactionGroup.getLinkedRecord('users', {first: 11});
  users.setValue(
    Math.max(0, users.getValue('totalCount') + (viewerHasReacted ? 1 : -1)),
    'totalCount',
  );
}

async function addReaction({environment, content, subjectId}) {
  const variables = {
    input: {
      content,
      subjectId,
    },
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: addReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({response, errors}),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({store, viewerHasReacted: true, content, subjectId}),
    });
  });
}

async function removeReaction({environment, content, subjectId}) {
  const variables = {
    input: {
      content,
      subjectId,
    },
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: removeReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({response, errors}),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({store, viewerHasReacted: false, content, subjectId}),
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
  context: 'list' | 'details',
};

export function PostBox({children}: {children: React.Node}) {
  return (
    <Box
      margin="medium"
      style={{
        maxWidth: 704,
        borderRadius: 2,
      }}>
      {children}
    </Box>
  );
}

export const ReactionBar = ({
  reactionGroups,
  relay,
  subjectId,
  pad,
}: {
  reactionGroups: *,
  relay: RelayProp,
  subjectId: string,
  pad?: string,
}) => {
  const {error: notifyError} = React.useContext(NotificationContext);
  const [showReactionPopover, setShowReactionPopover] = React.useState(false);
  const popoverInstance = React.useRef();
  const {isLoggedIn, login} = React.useContext(UserContext);

  const usedReactions = (reactionGroups || []).filter(
    g => g.users.totalCount > 0,
  );

  return (
    <Box
      pad={pad || 'xsmall'}
      direction="row"
      wrap={true}
      border={{size: 'xsmall', side: 'top', color: 'rgba(0,0,0,0.1)'}}>
      <TippyGroup delay={500}>
        {usedReactions.map(g => {
          const total = g.users.totalCount;
          const reactors = (g.users.nodes || []).map(x =>
            x ? x.name || x.login : null,
          );
          if (total > 11) {
            reactors.push(`${total - 11} more`);
          }

          const reactorsSentence = [
            ...reactors.slice(0, reactors.length - 2),
            reactors.slice(-2).join(reactors.length > 2 ? ', and ' : ' and '),
          ].join(', ');

          return (
            <Tippy
              key={g.content}
              arrow={true}
              trigger="mouseenter focus click"
              placement="bottom"
              flipBehavior={['bottom', 'right']}
              theme="light-border"
              inertia={true}
              interactive={true}
              animateFill={false}
              interactiveBorder={10}
              duration={[75, 75]}
              content={
                <div>
                  {reactorsSentence} reacted with{' '}
                  {lowerCase(sentenceCase(g.content))} emoji
                </div>
              }>
              <span
                key={g.content}
                style={{
                  padding: '0 16px',
                  borderRight: '1px solid rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Text>{emojiForContent(g.content)} </Text>
                <Text size="small" style={{marginLeft: 8}}>
                  {g.users.totalCount}
                </Text>
              </span>
            </Tippy>
          );
        })}
      </TippyGroup>
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
                    subjectId,
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
                    subjectId,
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
  );
};

function slugify(s: string): string {
  return lowerCase(s)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .trimStart() // Trim from start of text
    .trimEnd(); // Trim from end of text
}

export function postPath({
  post,
  viewComments,
}: {
  post: {
    +number: number,
    +repository: {+owner: {+login: string}, +name: string},
    +title: string,
  },
  viewComments?: boolean,
}) {
  return `/post/${post.number}/${slugify(post.title)}${
    viewComments ? '#comments' : ''
  }`;
}

const markdownParser = unified().use(parse);

function visitBackmatter(node, fn) {
  if (node.type === 'code' && node.lang === 'backmatter') {
    fn(node);
  }
  if (node.children && node.children.length) {
    for (const child of node.children) {
      visitBackmatter(child, fn);
    }
  }
}

function postBackmatter(post) {
  const backmatter = {};
  const ast = markdownParser.parse(post.body);
  visitBackmatter(ast, node => {
    try {
      Object.assign(backmatter, JSON.parse(node.value));
    } catch (e) {
      console.error('Error visiting backmatter', e);
    }
  });
  return backmatter;
}

export function computePostDate(post: {
  +body: string,
  +createdAt: string,
}): Date {
  const backmatter = postBackmatter(post);
  if (backmatter.publishedDate) {
    return new Date(backmatter.publishedDate);
  }
  return new Date(post.createdAt);
}

export const Post = ({relay, post, context}: Props) => {
  const {error: notifyError} = React.useContext(NotificationContext);
  const [showReactionPopover, setShowReactionPopover] = React.useState(false);
  const postDate = React.useMemo(() => computePostDate(post), [post]);
  const popoverInstance = React.useRef();
  const {isLoggedIn, login} = React.useContext(UserContext);

  const usedReactions = (post.reactionGroups || []).filter(
    g => g.users.totalCount > 0,
  );
  const authors = post.assignees.nodes || [];
  return (
    <PostBox>
      <Helmet>
        <title>{post.title}</title>
      </Helmet>
      <Box pad="medium">
        <Heading level={1} margin="none">
          {context === 'details' ? (
            post.title
          ) : (
            <Link
              style={{color: 'inherit'}}
              to={postPath({post})}
              onMouseOver={() =>
                fetchQuery(relay.environment, postRootQuery, {
                  issueNumber: post.number,
                })
              }>
              {post.title}
            </Link>
          )}
        </Heading>

        {authors.length > 0 ? (
          <Box direction="row" gap="medium">
            {authors.map((node, i) =>
              node ? (
                <Box
                  key={node.id}
                  align="center"
                  direction="row"
                  margin={{vertical: 'medium'}}>
                  <a href={node.url}>
                    <Box>
                      <img
                        alt={node.name}
                        src={imageUrl({src: node.avatarUrl})}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          marginRight: 8,
                        }}
                      />
                    </Box>
                  </a>
                  <Box>
                    <a href={node.url}>
                      <Text size="small">{node.name || node.login}</Text>
                    </a>
                    <Text
                      size="xsmall"
                      style={{visibility: i === 0 ? 'visible' : 'hidden'}}>
                      {formatDate(postDate, 'MMM do, yyyy')}
                    </Text>
                  </Box>
                </Box>
              ) : null,
            )}
          </Box>
        ) : null}
        <Box direction="row" justify="between"></Box>
        <Text>
          <MarkdownRenderer escapeHtml={true} source={post.body} />
        </Text>
      </Box>
      <ReactionBar
        relay={relay}
        subjectId={post.id}
        reactionGroups={post.reactionGroups}
      />
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
          }
        }
      }
      commentsCount: comments {
        totalCount
      }
      repository {
        name
        owner {
          login
          avatarUrl(size: 192)
        }
      }
    }
  `,
});
