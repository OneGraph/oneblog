import graphql from 'babel-plugin-relay/macro';
import {fetchQuery} from 'react-relay';
import {createEnvironment} from './Environment';
import {slugify} from './Post';

export const query = graphql`
  # repoName and repoOwner provided by fixedVariables
  query staticPaths_Query(
    $repoName: String!
    $repoOwner: String!
    $count: Int!
    $cursor: String
  )
    @persistedQueryConfiguration(
      accessToken: {environmentVariable: "OG_GITHUB_TOKEN"}
      fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
      freeVariables: ["count", "cursor"]
      cacheSeconds: 60
    ) {
    gitHub {
      repository(name: $repoName, owner: $repoOwner) {
        issues(
          first: $count
          filterBy: {labels: ["publish", "Publish"]}
          orderBy: {field: CREATED_AT, direction: DESC}
          after: $cursor
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            id
            number
          }
        }
      }
    }
  }
`;

export async function getStaticPaths() {
  let cursor = null;
  let hasNextPage = true;
  const issues = [];
  const environment = createEnvironment();
  while (hasNextPage) {
    const data = await fetchQuery(environment, query, {
      count: 100,
      cursor,
    });
    cursor = data.gitHub.repository.issues.pageInfo.endCursor;
    // Only get the newest 100 for now to prevent API limits
    // TODO: Find a way to satisfy `getStaticProps` with the results of the
    //       query in this file
    hasNextPage = false; //data.gitHub.repository.issues.pageInfo.hasNextPage;
    for (const issue of data.gitHub.repository.issues.nodes) {
      issues.push(issue);
    }
  }
  return issues.map(issue => ({
    params: {
      slug: [String(issue.number), slugify(issue.title)],
    },
  }));
}
