//@flow

import {SitemapStream, streamToPromise} from 'sitemap';
import {postPath} from './Post';
import {createEnvironment} from './Environment';
import {fetchQuery} from 'react-relay/hooks';
import graphql from 'babel-plugin-relay/macro';
import useBasePath from './lib/useBasePath';

import type {Sitemap_QueryResponse} from './__generated__/Sitemap_Query.graphql';

const sitemapQuery = graphql`
  query Sitemap_Query(
    $repoOwner: String!
    $repoName: String!
    $cursor: String
    $subdomain: String!
  )
  @persistedQueryConfiguration(
    accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["cursor", "subdomain"]
    cacheSeconds: 300
  ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        issues(
          first: 100
          after: $cursor
          orderBy: {direction: DESC, field: CREATED_AT}
          filterBy: {createdBy: $subdomain}
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
  }
`;

export async function buildSitemap({
  siteHostname,
  subdomain,
}: {
  siteHostname: string,
  subdomain: sttring,
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const basePath = useBasePath();
  const smStream = new SitemapStream({hostname: `${siteHostname}`});
  smStream.write({url: `${basePath}/`});

  const environment = createEnvironment();

  let hasNextPage = true;
  let cursor = null;
  // Only fetch the first 1000
  let reqCount = 0;

  while (hasNextPage && reqCount <= 10) {
    const data: ?Sitemap_QueryResponse = await fetchQuery(
      environment,
      sitemapQuery,
      {cursor, subdomain},
    ).toPromise();
    reqCount++;

    for (const node of data?.gitHub?.repository?.issues?.nodes || []) {
      if (node) {
        smStream.write({
          url: `${basePath}${postPath({post: node})}`,
          lastmod: node.updatedAt,
        });
      }
    }
    const pageInfo = data?.gitHub?.repository?.issues?.pageInfo;
    hasNextPage = pageInfo?.hasNextPage;
    cursor = pageInfo?.endCursor;
    hasNextPage = cursor ? pageInfo?.hasNextPage : false;
  }
  smStream.end();
  return await streamToPromise(smStream);
}
