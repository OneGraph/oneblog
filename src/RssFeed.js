// @flow

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Feed} from 'feed';
import idx from 'idx';
import graphql from 'babel-plugin-relay/macro';
import {environment} from './Environment';
import {fetchQuery} from 'react-relay';
import {computePostDate, postPath} from './Post';
import {RssMarkdownRenderer} from './MarkdownRenderer';
import {ServerStyleSheet} from 'styled-components';
import inlineCss from 'inline-css/lib/inline-css';
import {Grommet} from 'grommet/components/Grommet';
import {Box} from 'grommet/components/Box';
import {theme} from './App';
import appCss from './App.css';
import githubStyle from 'react-syntax-highlighter/dist/cjs/styles/hljs/github';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight';
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

  const css = sheet.instance.toString();
  return inlineCss(markup, `${appCss.toString()}\n${css}`, {codeBlocks: {}});
}

function removeTrailingSlash(s: ?string): string {
  if (!s) {
    return '';
  }
  if (s[s.length - 1] === '/') {
    return s.substr(0, s.length - 1);
  }
  return s;
}

export async function buildFeed({
  basePath,
  siteHostname,
}: {
  basePath?: ?string,
  siteHostname?: ?string,
}) {
  const data: RssFeed_QueryResponse = await fetchQuery(
    environment,
    feedQuery,
    {},
  );

  const posts = idx(data, _ => _.gitHub.repository.issues.nodes) || [];
  const latestPost = posts[0];

  const baseUrl = removeTrailingSlash(
    `${removeTrailingSlash(siteHostname)}${basePath ? basePath : ''}`,
  );

  const feed = new Feed({
    title: 'OneGraph Product Updates',
    description:
      'Keep up to date with the latest product features from OneGraph',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/logo.png`,
    favicon: `${baseUrl}/favicon.ico`,
    updated: latestPost ? computePostDate(latestPost) : null,
    generator: '',
    feedLinks: {
      json: `${baseUrl}/feed.json`,
      atom: `${baseUrl}/feed.atom`,
      rss2: `${baseUrl}/feed.rss`,
    },
  });

  for (const post of posts) {
    if (post) {
      const content = renderPostHtml(post);
      const body = feed.addItem({
        title: post.title,
        id: post.id,
        link: `${baseUrl}${postPath({post})}`,
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
