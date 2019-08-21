// @flow

import {Feed} from 'feed';
import idx from 'idx';
import graphql from 'babel-plugin-relay/macro';
import {environment} from './Environment';
import {fetchQuery} from 'react-relay';

import type {RssFeed_QueryResponse} from './__generated__/RssFeed_Query.graphql';

const feedQuery = graphql`
  query RssFeed_Query
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    ) {
    gitHub {
      repository(name: "onegraph-changelog", owner: "onegraph") {
        issues(
          first: 20
          orderBy: {direction: DESC, field: CREATED_AT}
          labels: ["publish"]
        ) {
          nodes {
            id
            number
            title
            bodyHTML
            createdAt
            assignees(first: 10) {
              nodes {
                id
                name
                url
              }
            }
          }
        }
      }
    }
  }
`;

export async function buildFeed() {
  const data: RssFeed_QueryResponse = await fetchQuery(
    environment,
    feedQuery,
    {},
  );

  const posts = idx(data, _ => _.gitHub.repository.issues.nodes) || [];
  const latestPost = posts[0];

  const feed = new Feed({
    title: 'OneGraph Product Updates',
    description:
      'Keep up to date with the latest product features from OneGraph',
    id: 'https://onegraph.com/changelog',
    link: 'https://onegraph.com/changelog',
    language: 'en',
    image: 'https://onegraph.com/changelog/logo.png',
    favicon: 'https://onegraph.com/favicon.ico',
    updated: latestPost ? new Date(latestPost.createdAt) : null,
    generator: '',
    feedLinks: {
      json: 'https://onegraph.com/changelog/feed.json',
      atom: 'https://onegraph.com/changelog/feed.atom',
      rss2: 'https://onegraph.com/changelog/feed.rss',
    },
  });

  for (const post of posts) {
    if (post) {
      feed.addItem({
        title: post.title,
        id: post.id,
        link: `https://onegraph.com/changelog/post/${post.number}`,
        content: post.bodyHTML,
        author: (post.assignees.nodes || []).map(node =>
          node
            ? {
                name: node.name,
                link: node.url,
              }
            : null,
        ),
        date: new Date(post.createdAt),
      });
    }
  }
  return feed;
}
