// @flow

import React from 'react';
import {useLazyLoadQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import Header from './Header';
import {editIssueUrl} from './issueUrls';
import {Github} from 'grommet-icons/icons/Github';
import Comments from './Comments';
import Post from './Post';
import ErrorBox from './ErrorBox';
import Head from 'next/head';
import config from './config';
import Attribution from './Attribution';
import parseMarkdown from './lib/parseMarkdown';
import {useRouter} from 'next/router';

import type {
  PostRoot_PostQuery,
  PostRoot_PostQueryResponse,
} from './__generated__/PostRoot_PostQuery.graphql';

export const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query PostRoot_PostQuery(
    $issueNumber: Int!
    $repoName: String!
    $repoOwner: String!
  )
  @persistedQueryConfiguration(
    accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["issueNumber"]
    cacheSeconds: 300
  ) {
    gitHub {
      viewer {
        login
        name
        avatarUrl(size: 96)
        url
      }
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
      repository(name: $repoName, owner: $repoOwner) {
        issue(number: $issueNumber) {
          labels(first: 100) {
            nodes {
              name
            }
          }
          title
          id
          number
          body
          ...Post_post
          ...Comments_post
        }
      }
    }
  }
`;

const textTypes = ['text', 'inlineCode'];
const breakTypes = ['heading', 'paragraph', 'break', 'blockquote'];

function textOfAst(node: any): string {
  if (textTypes.includes(node.type)) {
    return node.value;
  } else if (node.children && node.children.length) {
    const texts = [];
    if (breakTypes.includes(node.type)) {
      texts.push('\n\n');
    }
    for (const text of node.children.map(textOfAst)) {
      if (text) {
        texts.push(text);
      }
    }
    return texts.join('');
  } else {
    return '';
  }
}

function buildDescription(body) {
  const ast = parseMarkdown(body);
  const text = textOfAst(ast).trim();
  if (text.length <= 200) {
    return text;
  } else {
    return `${text.slice(0, 197)}...`;
  }
}

export const PostRoot = ({issueNumber}: {issueNumber: number}) => {
  const {basePath} = useRouter();
  const data: ?PostRoot_PostQueryResponse = useLazyLoadQuery<PostRoot_PostQuery>(
    query,
    // $FlowFixMe: expects persisted variables
    {issueNumber},
    // TODO: fill store with dataID for root record from list view so that partial rendering works
    {fetchPolicy: 'store-and-network', UNSTABLE_renderPolicy: 'partial'},
  );

  if (!data) {
    return null;
  }

  const post = data?.gitHub?.repository?.issue;
  const labels = post?.labels?.nodes;
  const gitHub = data?.gitHub;
  if (
    !gitHub ||
    !post ||
    !labels ||
    !labels.find((l) => l && l.name.toLowerCase() === 'publish')
  ) {
    return <ErrorBox error={new Error('Missing post.')} />;
  } else {
    const title = `${post.title} - ${config.title}`;
    const description = buildDescription(post.body);

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta key="og:title" property="og:title" content={title} />

          {config.siteHostname || config.vercelUrl ? (
            <meta
              key="og:image"
              property="og:image"
              // n.b. Ok to use vercel url for og-image as a fallback, but
              // careful not to use it as a canonical url
              content={`${
                // $FlowFixMe: checked above
                config.siteHostname || config.vercelUrl
              }${basePath}/api/og-image/${post.number}`}
            />
          ) : null}
          <meta key="type" property="og:type" content="article" />
          <meta
            key="description"
            property="description"
            content={description}
          />
          <meta
            key="og:description"
            property="og:description"
            content={description}
          />
        </Head>
        <Header
          gitHub={gitHub}
          adminLinks={[
            {
              label: 'Edit post',
              href: editIssueUrl({issueNumber: post.number}),
              icon: <Github size="16px" />,
            },
          ]}
        />
        <Post context="details" post={post} />
        <Comments post={post} postId={post.id} viewer={gitHub.viewer} />
        <Attribution />
      </>
    );
  }
};
