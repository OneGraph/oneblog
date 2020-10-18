// @flow

import React from 'react';
import {Box, Heading, Text, Avatar, Paragraph, Button, Select} from 'grommet';
import {useLazyLoadQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import {postPath} from './Post';
import {newIssueUrl} from './issueUrls';
import {CodeBlock} from './MarkdownRenderer';
import {defaultThemeColors} from './lib/codeHighlight';

import type {
  LandingQuery,
  LandingQueryResponse,
} from './__generated__/LandingQuery.graphql';

const IS_DEV = process.env.NODE_ENV === 'development';

export const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query LandingQuery($repoName: String!, $repoOwner: String!)
  @persistedQueryConfiguration(
    accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    cacheSeconds: 300
  ) {
    gitHub {
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        issues(
          filterBy: {labels: ["Highlight"]}
          orderBy: {field: CREATED_AT, direction: DESC}
          first: 10
        ) {
          nodes {
            number
            title
            author {
              login
              ... on GitHubUser {
                name
              }
              avatarUrl(size: 96)
            }
          }
        }
      }
    }
  }
`;

const P = (props) => <Paragraph fill={true} {...props} />;

function LatestPosts() {
  const data: ?LandingQueryResponse = useLazyLoadQuery<LandingQuery>(
    query,
    // $FlowFixMe: expects variables that were persisted
    {},
    {fetchPolicy: 'store-and-network'},
  );

  const posts: Array<{|
    +author: {|
      +avatarUrl: any,
      +login: string,
      +name?: ?string,
    |},
    +number: number,
    +title: string,
  |}> = [];
  const nodes = data.gitHub?.repository?.issues?.nodes;
  if (nodes) {
    for (const issue of nodes) {
      if (issue) {
        const author = issue.author;
        if (author) {
          // Satisfy flow
          posts.push({...issue, author});
        }
      }
    }
  }
  return posts.map((post) => (
    <Box
      direction="row"
      gap="small"
      key={post.number}
      margin={{bottom: 'medium'}}>
      <Box flex={{shrink: 0}}>
        <Avatar src={post.author.avatarUrl} />{' '}
      </Box>
      <Box>
        <a
          href={`${IS_DEV ? 'http' : 'https'}://${post.author.login}.${
            IS_DEV ? 'localhost:3001' : 'essay.dev'
          }${postPath({post})}`}>
          {post.title}
        </a>
        <Text size="small">{post.author?.name || post.author?.login}</Text>
      </Box>
    </Box>
  ));
}

const sampleCode = `import React from 'react';
import ReactDOM from "react-dom";

function Message() {
  return (
    <div className="hello" onClick={someFunc}>
      <span>Hello World</span>
    </div>
  );
}

ReactDOM.render(<Message />, document.body);`;

function CodeHighlightExample() {
  const [theme, setTheme] = React.useState('dark-plus');
  return (
    <Box>
      <Select
        options={Object.keys(defaultThemeColors)}
        value={theme}
        onChange={({option}) => setTheme(option)}
      />
      <CodeBlock
        // CodeBlock doesn't handle props changing, so force remount
        value={sampleCode}
        language="js"
        theme={theme}
      />
    </Box>
  );
}

export default function Landing() {
  return (
    <Box
      align="center"
      margin="medium"
      pad={{horizontal: 'medium'}}
      style={{
        maxWidth: 704,
      }}>
      <Box>
        <Heading level={2}>Essay.dev</Heading>

        <Text>
          <P>
            Essay.dev is a blogging service by{' '}
            <a href="https://onegraph.com">OneGraph</a> that lets you publish
            your own blog by creating an issue on GitHub.
          </P>
          <P>
            <a href={newIssueUrl()} rel="noopener noreferrer" target="_blank">
              Create an issue on OneGraph/essay.dev
            </a>{' '}
            and it will become a blog post at your-github-username.essay.dev.
          </P>
          <P>
            It's the easiest way to start a developer-focused blog. You don't
            have to sign up for anything or even log in. Just create an issue
            and that's your first post.
          </P>
          <P>
            Since it's backed by GitHub issues, anybody with a GitHub account
            can add a comment or reaction to your post and you'll get a
            notification through the GitHub notification system that you're
            already familiar with.
          </P>
          <P>
            Unlike other platforms (looking at you Medium), if you ever want to
            move your content to a different platform, you can export all of
            your data in full fidelity as markdown or HTML.
          </P>
          <P>
            If you'd prefer to host your content yourself or on your own domain,
            there's a{' '}
            <a
              href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext&env=NEXT_PUBLIC_ONEGRAPH_APP_ID,NEXT_PUBLIC_TITLE,OG_GITHUB_TOKEN,OG_DASHBOARD_ACCESS_TOKEN,VERCEL_URL,VERCEL_GITHUB_ORG,VERCEL_GITHUB_REPO&envDescription=Variables%20needed%20to%20build%20your%20OneBlog&envLink=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext%23environment-variables&project-name=oneblog&repo-name=oneblog"
              target="_blank"
              rel="noreferrer noopener">
              Vercel button
            </a>{' '}
            for that.
          </P>
        </Text>

        <Heading level={3}>Latest articles</Heading>
        <LatestPosts />

        <Heading margin={{bottom: 'none'}} level={3}>
          How it works
        </Heading>
        <Text>
          <P>
            Issues are fetched from GitHub using OneGraph's persisted GraphQL
            queries. Persisted queries are an underutilized GraphQL feature with
            many benefits over plain queries. The benefit that makes them
            well-suited for our use-case is that we can attach metadata to the
            query.
          </P>
          <P>
            GitHub doesn't allow unauthenticated queries, so we attach a default
            auth to the query when we persist it. We also tell OneGraph to only
            allow requests for issues from the essay.dev repo and to cache the
            results of the query for 5 minutes so that we don't blow through our
            rate limit. You can read more about{' '}
            <a
              href="https://www.onegraph.com/docs/persisted_queries.html"
              target="_blank"
              rel="noopener noreferrer">
              persisted queries in the OneGraph docs
            </a>
            .
          </P>
          <P>
            We use the{' '}
            <a href="https://vercel.com/blog/wildcard-domains">
              wildcard domains
            </a>{' '}
            support from Vercel and next.js to determine the author from the
            subdomain. The first part of the subdomain tells us which GitHub
            user's issues to fetch.
          </P>
          <P>
            All of the code is published on GitHub. Essay.dev uses the{' '}
            <a href="https://github.com/OneGraph/oneblog/tree/essay.dev">
              essay.dev
            </a>{' '}
            branch of the{' '}
            <a href="https://github.com/OneGraph/oneblog/tree/next">OneBlog</a>{' '}
            repo with a few changes required to support multiple users on the
            same domain.
          </P>
        </Text>
        <Heading margin={{bottom: 'none'}} level={3}>
          Features
        </Heading>
        <Text>
          <P>Comments and reactions backed by GitHub.</P>
          <P>Full markdown support.</P>
          <P>
            Beautiful code highlighting with support for 90 languages and 20
            themes.
          </P>
          <CodeHighlightExample />
          <P>
            Fully-featured RSS feed, with the proper meta tags for
            auto-discovery.
          </P>
          <P>
            Open Graph tags so that your posts look great when you share them on
            social media.
          </P>
          <P>
            SEO friendly, with a sitemap properly linked from the robots.txt so
            that searh engines will find you.
          </P>

          <P>
            <Box align="center">
              <Button href={newIssueUrl()} label="Create your first post" />
            </Box>
          </P>

          <P>
            Questions? Create an{' '}
            <a href="https://github.com/OneGraph/oneblog/issues/new">
              issue on the OneBlog repo
            </a>{' '}
            or hop into our <a href="https://onegraph.com/chat">Spectrum</a>.
          </P>
        </Text>
      </Box>
    </Box>
  );
}
