// @flow

import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import {type RelayProp} from 'react-relay';
import {useFragment} from 'react-relay/hooks';
import {PostBox, ReactionBar} from './Post';
import type {Comment_comment$key} from './__generated__/Comment_comment.graphql';
import LoadingSpinner from './loadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';
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
  comment: Comment_comment$key,
};

export default function Comment({comment}: Props) {
  const data = useFragment(
    graphql`
      fragment Comment_comment on GitHubIssueComment {
        id
        body
        createdViaEmail
        author {
          ... on GitHubUser {
            name
            avatarUrl(size: 96)
            login
            url
          }
          ... on GitHubBot {
            avatarUrl(size: 96)
            login
            url
          }
          ... on GitHubOrganization {
            name
            avatarUrl(size: 96)
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
    comment,
  );
  const source = data.createdViaEmail
    ? new EmailReplyParser().read(data.body).getVisibleText()
    : data.body;
  return (
    <PostBox key={data.id}>
      <Box pad={{left: 'small'}} direction="row" align="center" gap="xsmall">
        <img
          width={24}
          height={24}
          style={{borderRadius: '50%'}}
          src={imageUrl({src: data.author?.avatarUrl})}
        />
        <Text size="xsmall">
          <a href={data.author?.url}>
            {data.author?.name || data.author?.login}
          </a>{' '}
          commented{' '}
          <span title={format(new Date(data.createdAt), 'PPP, pp')}>
            {formatDistance(new Date(), new Date(data.createdAt))} ago
          </span>
        </Text>
      </Box>
      <Box pad={{horizontal: 'small'}}>
        <MarkdownRenderer escapeHtml={true} source={source} />
      </Box>
      <ReactionBar
        pad="none"
        reactionGroups={data.reactionGroups}
        subjectId={data.id}
      />
    </PostBox>
  );
}
