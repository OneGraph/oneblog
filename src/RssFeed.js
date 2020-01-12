// @flow

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Feed} from 'feed';
import idx from 'idx';
import graphql from 'babel-plugin-relay/macro';
import {environment} from './Environment';
import {fetchQuery} from 'react-relay';
import {computePostDate} from './Post';
import {RssMarkdownRenderer} from './MarkdownRenderer';
import {ServerStyleSheet} from 'styled-components';
import inlineCss from 'inline-css/lib/inline-css';
import {Grommet, Box} from 'grommet';
import {theme} from './App';
import appCss from './App.css';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import githubStyle from 'react-syntax-highlighter/dist/cjs/styles/hljs/github';
import type {RssFeed_QueryResponse} from './__generated__/RssFeed_Query.graphql';

const feedQuery = graphql`
  query RssFeed_Query($repoOwner: String!, $repoName: String!)
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        issues(
          first: 20
          orderBy: {direction: DESC, field: CREATED_AT}
          labels: ["publish", "Publish"]
        ) {
          nodes {
            ...Post_post @relay(mask: false)
          }
        }
      }
    }
  }
`;

function SyntaxHighlighter(props) {
  return <ReactSyntaxHighlighter style={githubStyle} {...props} />;
}

function renderPostHtml(post) {
  const sheet = new ServerStyleSheet();
  const markup = renderToStaticMarkup(
    sheet.collectStyles(
      <Grommet theme={theme}>
        <div
          style={{
            maxWidth: 704,
          }}>
          <RssMarkdownRenderer
            source={post.body}
            SyntaxHighlighter={SyntaxHighlighter}
            escapeHtml={true}
          />
        </div>
      </Grommet>,
    ),
  );
  const css = sheet.instance.tags.map(t => t.css()).join('\n');
  return inlineCss(markup, `${appCss.toString()}\n${css}`, {codeBlocks: {}});
}

// TODO: make these fields configurable
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
    updated: latestPost ? computePostDate(latestPost) : null,
    generator: '',
    feedLinks: {
      json: 'https://onegraph.com/changelog/feed.json',
      atom: 'https://onegraph.com/changelog/feed.atom',
      rss2: 'https://onegraph.com/changelog/feed.rss',
    },
  });

  for (const post of posts) {
    if (post) {
      const content = renderPostHtml(post);
      const body = feed.addItem({
        title: post.title,
        id: post.id,
        link: `https://onegraph.com/changelog/post/${post.number}`,
        content,
        author: (post.assignees.nodes || []).map(node =>
          node
            ? {
                name: node.name,
                link: node.url,
              }
            : null,
        ),
        date: computePostDate(post),
      });
    }
  }
  return feed;
}
