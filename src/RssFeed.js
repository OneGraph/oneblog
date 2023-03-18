// @flow

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Feed} from 'feed';
import graphql from 'babel-plugin-relay/macro';
import {createEnvironment} from './Environment';
import {fetchQuery} from 'react-relay/hooks';
import {postBackmatter, computePostDate, postPath} from './Post';
import {RssMarkdownRenderer} from './MarkdownRenderer';
import {ServerStyleSheet} from 'styled-components';
import inlineCss from 'inline-css/lib/inline-css';
import {Grommet} from 'grommet/components/Grommet';
import appCss from './App.css';
import config from './config';
import type {RssFeed_QueryResponse} from './__generated__/RssFeed_Query.graphql';
import theme from './lib/theme';

const feedQuery = graphql`
  query RssFeed_Query($repoOwner: String!, $repoName: String!)
  @persistedQueryConfiguration(
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    cacheSeconds: 300
  ) {
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
`;

function renderPostHtml(post) {
  const sheet = new ServerStyleSheet();
  const markup = renderToStaticMarkup(
    sheet.collectStyles(
      <Grommet theme={theme}>
        <div
          style={{
            maxWidth: 704,
          }}>
          <RssMarkdownRenderer trustedInput={true} source={post.body} />
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

function postDate(post) {
  return computePostDate({
    backmatter: postBackmatter(post),
    createdAt: post.createdAt,
  });
}

export async function buildFeed({
  basePath,
  siteHostname,
}: {
  basePath?: ?string,
  siteHostname?: ?string,
}) {
  const markdowns = [];
  const environment = createEnvironment({
    registerMarkdown: function (m) {
      markdowns.push(m);
    },
  });
  const data: ?RssFeed_QueryResponse = await fetchQuery(
    environment,
    feedQuery,
    {},
  ).toPromise();

  const posts = data?.repository?.issues.nodes || [];
  const latestPost = posts[0];

  const baseUrl = removeTrailingSlash(
    `${removeTrailingSlash(siteHostname)}${basePath ? basePath : ''}`,
  );

  const feed = new Feed({
    title: config.title,
    description: config.description || '',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/logo.png`,
    favicon: `${baseUrl}/favicon.ico`,
    updated: latestPost ? postDate(latestPost) : null,
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
      feed.addItem({
        title: post.title,
        id: post.id,
        link: `${baseUrl}${postPath({post})}`,
        content,
        author: (post.assignees.nodes || []).map((node) =>
          node
            ? {
                name: node.name,
                link: node.url,
              }
            : null,
        ),
        date: postDate(post),
      });
    }
  }
  return feed;
}
