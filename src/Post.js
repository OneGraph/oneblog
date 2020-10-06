/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow

import * as React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {
  createFragmentContainer,
  commitMutation,
  type RelayProp,
} from 'react-relay';
import {loadQuery} from 'react-relay/hooks';
import {useRelayEnvironment} from 'react-relay/hooks';
import MarkdownRenderer from './MarkdownRenderer';
import formatDate from 'date-fns/format';
import EmojiIcon from './emojiIcon';
import AddIcon from './addIcon';
import Tippy, {useSingleton} from '@tippyjs/react';
import Link from 'next/link';
import GitHubLoginButton from './GitHubLoginButton';
import {NotificationContext} from './Notifications';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Text} from 'grommet/components/Text';
import UserContext from './UserContext';
import {lowerCase} from 'lower-case';
import {sentenceCase} from 'sentence-case';
import imageUrl from './imageUrl';
import {query as postRootQuery} from './PostRoot';
import {query as postsRootQuery} from './PostsRoot';
import CommentsIcon from './CommentsIcon';
import parseMarkdown from './lib/parseMarkdown';

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
    ?.getLinkedRecords('reactionGroups')
    ?.find((r) => r?.getValue('content') === content);

  if (reactionGroup) {
    reactionGroup.setValue(viewerHasReacted, 'viewerHasReacted');
    const users = reactionGroup.getLinkedRecord('users', {first: 11});
    if (users) {
      users.setValue(
        Math.max(
          0,
          // $FlowFixMe
          (users?.getValue('totalCount') ?? 0) + (viewerHasReacted ? 1 : -1),
        ),
        'totalCount',
      );
    }
  }
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
      onError: (err) => reject(err),
      optimisticUpdater: (store) =>
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
      onError: (err) => reject(err),
      optimisticUpdater: (store) =>
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
  const reactionContent = (reaction, i) => {
    const isSelected = viewerReactions.includes(reaction);
    return (
      <button
        style={{
          width: 42,
          height: 42,
          cursor: 'pointer',
          outline: 'none',
          fontSize: 20,
          padding: '0 5px',
          backgroundColor: isSelected ? '#ddefff' : 'transparent',
          border: 'none',
          borderLeft: i === 0 ? 'none' : '1px solid #e1e4e8',
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
    <Box>
      <Text margin="xsmall" textAlign="center">
        Pick your reaction
      </Text>

      {isLoggedIn ? (
        <>
          <Box
            direction="row"
            border={{
              color: '#e1e4e8',
              style: 'solid',
              size: '1px',
              side: 'top',
            }}>
            {reactions
              .slice(0, 4)
              .map((reaction, i) => reactionContent(reaction, i))}
          </Box>
          <Box
            direction="row"
            border={{
              color: '#e1e4e8',
              style: 'solid',
              size: '1px',
              side: 'top',
            }}>
            {reactions
              .slice(4)
              .map((reaction, i) => reactionContent(reaction, i))}
          </Box>
        </>
      ) : (
        <GitHubLoginButton onClick={login} />
      )}
    </Box>
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
      pad="medium"
      style={{
        maxWidth: 704,
        width: '100%',
        borderRadius: 2,
      }}>
      {children}
    </Box>
  );
}

export const ReactionBar = ({
  reactionGroups,
  subjectId,
  pad,
  commentsInfo,
}: {
  reactionGroups: *,
  subjectId: string,
  pad?: string,
  commentsInfo?: ?{
    href: string,
    as: string,
    count: number,
  },
}) => {
  const environment = useRelayEnvironment();
  const {error: notifyError} = React.useContext(NotificationContext);
  const [showReactionPopover, setShowReactionPopover] = React.useState(false);
  const [sourceTooltip, targetTooltip] = useSingleton();
  const [sourceAdd, targetAdd] = useSingleton();
  const {loginStatus, login} = React.useContext(UserContext);

  const isLoggedIn = loginStatus === 'logged-in';

  const usedReactions = (reactionGroups || [])
    .filter((g) => g.users.totalCount > 0)
    .sort((a, b) => b.users.totalCount - a.users.totalCount);

  return (
    <Box
      pad={pad || 'xsmall'}
      direction="row"
      justify="between"
      border={{size: 'xsmall', side: 'top', color: 'rgba(0,0,0,0.1)'}}>
      <Box direction="row">
        <Tippy
          singleton={sourceTooltip}
          arrow={false}
          theme="light-border"
          trigger="mouseenter focus click"
          placement="bottom"
          inertia={true}
          interactive={true}
          interactiveBorder={10}
          duration={[75, 75]}
          delay={500}
        />
        <Tippy
          singleton={sourceAdd}
          arrow={false}
          theme="light-border"
          trigger="click"
          inertia={true}
          interactive={true}
          interactiveBorder={10}
          duration={[0, 0]}
          delay={0}
          hideOnClick={true}
        />
        <Tippy
          singleton={targetAdd}
          arrow={true}
          content={
            <Box>
              <EmojiPicker
                isLoggedIn={isLoggedIn}
                login={login}
                viewerReactions={usedReactions
                  .filter((x) => x.viewerHasReacted)
                  .map((x) => x.content)}
                onDeselect={async (content) => {
                  // eslint-disable-next-line no-unused-expressions
                  sourceAdd?.data?.instance?.hide();
                  try {
                    await removeReaction({
                      environment,
                      content,
                      subjectId,
                    });
                  } catch (e) {
                    notifyError('Error removing reaction.');
                  }
                }}
                onSelect={async (content) => {
                  // eslint-disable-next-line no-unused-expressions
                  sourceAdd?.data?.instance?.hide();
                  try {
                    await addReaction({
                      environment,
                      content,
                      subjectId,
                    });
                  } catch (e) {
                    notifyError('Error adding reaction.');
                  }
                }}
              />
            </Box>
          }>
          <span
            style={{padding: '8px 16px'}}
            className="add-reaction-emoji"
            onClick={() => setShowReactionPopover(!showReactionPopover)}>
            <AddIcon width="12" />
            <EmojiIcon
              width="24"
              style={{marginLeft: 2, stroke: 'rgba(0,0,0,0)'}}
            />
          </span>
        </Tippy>
        <Box direction="row" style={{overflowY: 'scroll'}}>
          {usedReactions.map((g) => {
            const total = g.users.totalCount;
            const reactors = [];
            if (isLoggedIn && g.viewerHasReacted) {
              reactors.push('You');
            }
            for (const user of g.users.nodes || []) {
              if (
                user &&
                (!isLoggedIn || !user.isViewer) &&
                (user.name || user.login)
              ) {
                reactors.push(user.name || user.login);
              }
            }
            if (total > 11) {
              reactors.push(`${total - 11} more`);
            }

            const reactorsSentence = [
              ...reactors.slice(0, reactors.length - 2),
              reactors.slice(-2).join(reactors.length > 2 ? ', and ' : ' and '),
            ].join(', ');

            return (
              <Tippy
                singleton={targetTooltip}
                key={g.content}
                content={
                  <Box pad="xsmall">
                    <Text size="xsmall">
                      {reactorsSentence} reacted with{' '}
                      {lowerCase(sentenceCase(g.content))} emoji
                    </Text>
                  </Box>
                }>
                <span
                  key={g.content}
                  style={{
                    padding: '0 16px',
                    borderLeft: '1px solid rgba(0,0,0,0.12)',
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
        </Box>
      </Box>
      {commentsInfo ? (
        <Box direction="row" wrap={true}>
          <Link as={commentsInfo.as} href={commentsInfo.href}>
            <button
              title={commentsInfo.count ? 'View comments' : 'Leave a comment'}
              style={{
                cursor: 'pointer',
                outline: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                margin: 0,
                padding: 0,
              }}>
              <span
                style={{
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <CommentsIcon width="12" />
              </span>
            </button>
          </Link>
        </Box>
      ) : null}
    </Box>
  );
};

export function slugify(s: string): string {
  return lowerCase(s)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trimStart() // Trim from start of text
    .trimEnd(); // Trim from end of text
}

export function postPath({
  post,
  viewComments,
}: {
  post: {
    +number: number,
    //+repository: {+owner: {+login: string}, +name: string},
    +title: string,
  },
  viewComments?: boolean,
}) {
  return `/post/${post.number}/${slugify(post.title)}${
    viewComments ? '#comments' : ''
  }`;
}

function visitBackmatter(node: any, fn) {
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
  const ast = parseMarkdown(post.body);
  visitBackmatter(ast, (node) => {
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
  const environment = useRelayEnvironment();
  const postDate = React.useMemo(() => computePostDate(post), [post]);
  const number = post.number;

  const {loginStatus} = React.useContext(UserContext);
  const lastLoginStatus = React.useRef(loginStatus);

  React.useEffect(() => {
    if (
      lastLoginStatus.current === 'logged-out' &&
      loginStatus === 'logged-in'
    ) {
      // Refetch post if we log in to reset `viewerHasReacted` and friends
      loadQuery.loadQuery(
        environment,
        postRootQuery,
        {issueNumber: number},
        {fetchPolicy: 'network-only'},
      );
    }
    lastLoginStatus.current = loginStatus;
  }, [environment, loginStatus, number]);

  // Primitive preloading.
  // Ideally, we would be able to replace nextjs' preloading logic with our own
  // We like getStaticProps for SSR, but it's more efficient to fetch directly
  // from OneGraph once the client-side code is loaded, esp. when logged in
  React.useEffect(() => {
    if (context === 'list') {
      loadQuery.loadQuery(
        environment,
        postRootQuery,
        {issueNumber: number},
        {fetchPolicy: 'store-or-network'},
      );
    } else if (context === 'details') {
      loadQuery.loadQuery(
        environment,
        postsRootQuery,
        {},
        {fetchPolicy: 'store-or-network'},
      );
    }
  }, [environment, context, number]);

  const authors = post.assignees.nodes || [];
  return (
    <PostBox>
      <Box pad="medium">
        <Heading level={1} margin="none">
          {context === 'details' ? (
            post.title
          ) : (
            <Link href="/post/[...slug]" as={postPath({post})} shallow={true}>
              <a style={{color: 'inherit'}}>{post.title}</a>
            </Link>
          )}
        </Heading>

        {authors.length > 0 ? (
          <Box direction="row" gap="medium">
            {authors.map((node, i) => {
              if (!node) {
                return null;
              }
              const url = node.twitterUsername
                ? `https://twitter.com/${node.twitterUsername}`
                : node.websiteUrl || node.url;
              const name = node.name || node.twitterUsername || node.login;
              return (
                <Box
                  key={node.id}
                  align="center"
                  direction="row"
                  margin={{vertical: 'medium'}}>
                  <a href={url}>
                    <Box>
                      <img
                        alt={name}
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
                    <a href={url}>
                      <Text size="small">{name}</Text>
                    </a>
                    <Text
                      size="xsmall"
                      style={{visibility: i === 0 ? 'visible' : 'hidden'}}>
                      {formatDate(postDate, 'MMM do, yyyy')}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : null}
        <Box direction="row" justify="between"></Box>
        <MarkdownRenderer trustedInput={true} source={post.body} />
      </Box>
      <ReactionBar
        relay={relay}
        subjectId={post.id}
        reactionGroups={post.reactionGroups}
        commentsInfo={
          context === 'list'
            ? {
                href: '/post/[...slug]',
                as: postPath({post, viewComments: true}),
                count: post.commentsCount.totalCount,
              }
            : null
        }
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
      body @__clientField(handle: "registerMarkdown")
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
          avatarUrl(size: 96)
        }
      }
    }
  `,
});
