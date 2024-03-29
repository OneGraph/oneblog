//@flow

import {SitemapStream, streamToPromise} from 'sitemap';
import {postPath} from './Post';
import {createEnvironment} from './Environment';
import {fetchQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import useBasePath from './lib/useBasePath';

import type {Sitemap_Query$data} from './__generated__/Sitemap_Query.graphql';

const sitemapQuery = graphql`
  query Sitemap_Query($repoOwner: String!, $repoName: String!, $cursor: String)
  @persistedQueryConfiguration(
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["cursor"]
    cacheSeconds: 300
  ) {
    repository(name: $repoName, owner: $repoOwner) {
      issues(
        first: 100
        after: $cursor
        orderBy: {direction: DESC, field: CREATED_AT}
        labels: ["publish", "Publish"]
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          number
          title
          updatedAt
        }
      }
    }
  }
`;

export async function buildSitemap({siteHostname}: {siteHostname: string}) {
  const basePath = useBasePath();
  const smStream = new SitemapStream({hostname: `${siteHostname}`});
  smStream.write({url: `${basePath}/`});

  const environment = createEnvironment();

  let hasNextPage = true;
  let cursor = null;
  // Only fetch the first 1000
  let reqCount = 0;

  while (hasNextPage && reqCount <= 10) {
    const data: ?Sitemap_Query$data = await fetchQuery(
      environment,
      sitemapQuery,
      {cursor},
    ).toPromise();
    reqCount++;

    for (const node of data?.repository?.issues?.nodes || []) {
      if (node) {
        smStream.write({
          url: `${basePath}${postPath({post: node})}`,
          lastmod: node.updatedAt,
        });
      }
    }
    const pageInfo = data?.repository?.issues?.pageInfo;
    hasNextPage = pageInfo?.hasNextPage;
    cursor = pageInfo?.endCursor;
    hasNextPage = cursor ? pageInfo?.hasNextPage : false;
  }
  smStream.end();
  return await streamToPromise(smStream);
}
