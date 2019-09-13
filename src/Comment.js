// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer, type RelayProp} from 'react-relay';
import {PostBox, ReactionBar} from './Post';
import type {Comment_comment} from './__generated__/Comment_comment.graphql';
import LoadingSpinner from './loadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
import idx from 'idx';
import {Box, Heading, Text, TextArea, Tabs, Tab} from 'grommet';
import {formatDistance, format} from 'date-fns';
import EmailReplyParser from 'email-reply-parser';

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
      <Box
        border={{
          size: 'xsmall',
          side: 'bottom',
          color: 'rgba(0,0,0,0.1)',
        }}
        pad="small"
        direction="row"
        align="center"
        gap="xsmall">
        <img
          width={24}
          height={24}
          style={{borderRadius: '50%'}}
          src={idx(comment, _ => _.author.avatarUrl)}
        />
        <Text size="small">
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
      <Box pad="medium">
        <MarkdownRenderer escapeHtml={true} source={source} />
      </Box>
      <ReactionBar
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
          }
        }
      }
    }
  `,
});
