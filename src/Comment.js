// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer, type RelayProp} from 'react-relay';
import {PostBox, ReactionBar} from './Post';
import type {Comment_comment} from './__generated__/Comment_comment.graphql';
import LoadingSpinner from './loadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import idx from 'idx';
import {Box} from 'grommet/components/Box';
import {Heading} from 'grommet/components/Heading';
import {Text} from 'grommet/components/Text';
import {TextArea} from 'grommet/components/TextArea';
import {Tabs} from 'grommet/components/Tabs';
import {Tab} from 'grommet/components/Tab';
import format from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import EmailReplyParser from 'email-reply-parser';
import imageUrl from './imageUrl';

type Props = {
  relay: RelayProp,
  comment: Comment_comment,
};

function Comment({comment, relay}: Props) {
  const source = comment.createdViaEmail
    ? new EmailReplyParser().read(comment.body).getVisibleText()
    : comment.body;
  return (
    <PostBox key={comment.id}>
      <Box pad={{left: 'small'}} direction="row" align="center" gap="xsmall">
        <img
          width={24}
          height={24}
          style={{borderRadius: '50%'}}
          src={imageUrl({src: idx(comment, _ => _.author.avatarUrl)})}
        />
        <Text size="xsmall">
          <a href={idx(comment, _ => _.author.url)}>
            {idx(comment, _ => _.author.name) ||
              idx(comment, _ => _.author.login)}
          </a>{' '}
          commented{' '}
          <span title={format(new Date(comment.createdAt), 'PPP, pp')}>
            {formatDistance(new Date(), new Date(comment.createdAt))} ago
          </span>
        </Text>
      </Box>
      <Box pad={{horizontal: 'small'}}>
        <MarkdownRenderer escapeHtml={true} source={source} />
      </Box>
      <ReactionBar
        pad="none"
        reactionGroups={comment.reactionGroups}
        relay={relay}
        subjectId={comment.id}
      />
    </PostBox>
  );
}

export default createFragmentContainer(Comment, {
  comment: graphql`
    fragment Comment_comment on GitHubIssueComment {
      id
      body
      createdViaEmail
      author {
        ... on GitHubUser {
          name
          avatarUrl
          login
          url
        }
        ... on GitHubBot {
          avatarUrl
          login
          url
        }
        ... on GitHubOrganization {
          name
          avatarUrl
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
          }
        }
      }
    }
  `,
});
