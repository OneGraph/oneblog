// @flow

import React from 'react';
import {PostBox} from './Post';
import {Box, Heading} from 'grommet';
import ConfigContext from './ConfigContext';
import {newIssueUrl} from './issueUrls';

export default function Welcome() {
  const {config} = React.useContext(ConfigContext);
  return (
    <PostBox key="intro">
      <Box pad="medium">
        <Heading level={1} margin="none">
          This is your OneBlog
        </Heading>
        <p>
          There are no posts yet. Write the first post by{' '}
          <a href={newIssueUrl()}>creating an issue on GitHub</a>.
        </p>
        <p>
          Adding the Publish tag to any issue on the{' '}
          <a href={`https://github.com/${config.repoOwner}/${config.repoName}`}>
            {config.repoOwner}/{config.repoName}
          </a>{' '}
          repo will make it show up as a post here. That way, only collaborators
          on the repo have permission to create posts.
        </p>
        <p>The assignees on the issue turn into the authors of the post.</p>
        <Heading level={2}>You have complete control</Heading>
        <p>
          You're in complete control of this website and its content. If you
          don't like how something looks, you can change it by updating the code
          in the repo. A good place to start is the{' '}
          <a
            href={`https://github.com/${config.repoOwner}/${config.repoName}/blob/master/src/lib/theme.js`}>
            theme.js file
          </a>
          .
        </p>
        <p>
          We've set you up with a solid base. There's an{' '}
          <a href="/feed.rss">rss feed</a> (with proper meta tags for discovery
          by rss readers), <a href="/sitemap.xml">sitemap</a> (properly linked
          in the robots.txt), comments and reactions (backed by comments and
          reactions on the isssue), full markdown support, code highlighting,
          Open Graph tags, and Google Analytics support—all built with{' '}
          <a href="https://nextjs.org/">next.js</a>,{' '}
          <a href="https://relay.dev/">Relay</a>, and{' '}
          <a href="https://www.onegraph.com">OneGraph</a>.
        </p>
        <p>After you publish your first post, this text will go away .</p>
        <p>
          If you've written a post, but you don't see it, your request was
          probably served from the cache. OneGraph's persisted queries are
          configured to cache the requests to GitHub for 5 minutes to stay under
          the rate limit. You can log in above and refresh the page to bypass
          the cache.
        </p>
      </Box>
    </PostBox>
  );
}
