// @flow

import React from 'react';
import {PostBox} from './Post';
import {Box, Heading, Text} from 'grommet';
import ConfigContext from './ConfigContext';
import {newIssueUrl} from './issueUrls';

export default function Welcome() {
  const {config} = React.useContext(ConfigContext);
  return (
    <PostBox key="intro">
      <Box pad="medium">
        <Heading level={1} margin="none">
          Welcome
        </Heading>
        <Text>
          <p>
            There are no posts yet.{' '}
            <a href={newIssueUrl()}>Create an issue on GitHub</a> and it will
            become the first post here.
          </p>
          <p>
            If you created an issue and you don't see it here, your request was
            probably served from the cache. Queries are configured to cache
            requests to GitHub for 5 minutes to stay under the rate limit. You
            can log in above to bypass the cache.
          </p>

          <p>
            Your site is already set up with an <a href="/feed.rss">rss feed</a>{' '}
            (with proper meta tags for discovery by rss readers),{' '}
            <a href="/sitemap.xml">sitemap</a> (properly linked in the
            robots.txt), comments and reactions (backed by comments and
            reactions on the isssue), full markdown support, code highlighting,
            Open Graph tags for better sharing on social media, and Google
            Analytics support—all built with{' '}
            <a href="https://nextjs.org/">next.js</a>,{' '}
            <a href="https://relay.dev/">Relay</a>, and{' '}
            <a href="https://www.onegraph.com">OneGraph</a>.
          </p>
          <p>After you publish your first post, this text will go away.</p>
        </Text>
      </Box>
    </PostBox>
  );
}
