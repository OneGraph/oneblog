const fetch = require('node-fetch');
const yargs = require('yargs');

require('dotenv').config();

const REPO_NAME =
  process.env['RAZZLE_GITHUB_REPO_NAME'] ||
  process.env['NEXT_PUBLIC_GITHUB_REPO_NAME'] ||
  process.env['VERCEL_GITHUB_REPO'];
const REPO_OWNER =
  process.env['RAZZLE_GITHUB_REPO_OWNER'] ||
  process.env['NEXT_PUBLIC_GITHUB_REPO_OWNER'] ||
  process.env['VERCEL_GITHUB_ORG'];
const APP_ID =
  process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID || process.env.RAZZLE_ONEGRAPH_APP_ID;
const TOKEN = process.env.OG_GITHUB_TOKEN;
const DASHBOARD_TOKEN = process.env.OG_DASHBOARD_ACCESS_TOKEN;

if (!REPO_NAME) {
  throw new Error(
    'Missing repo name. Please export NEXT_PUBLIC_GITHUB_REPO_NAME',
  );
}

if (!REPO_OWNER) {
  throw new Error(
    'Missing repo owner. Please export NEXT_PUBLIC_GITHUB_REPO_OWNER',
  );
}

if (!APP_ID) {
  throw new Error('Missing appId. Please export NEXT_PUBLIC_ONEGRAPH_APP_ID');
}

if (!TOKEN) {
  throw new Error('Missing github token. Please export OG_GITHUB_TOKEN');
}

if (!DASHBOARD_TOKEN) {
  throw new Error(
    'Missing onegraph dashboard token. Please export OG_DASHBOARD_ACCESS_TOKEN',
  );
}

function getAllQueries() {
  const fs = require('fs');
  const path = require('path');
  const queries = [];
  for (const file of fs.readdirSync('./src/__generated__')) {
    const query = require(path.resolve('./src/__generated__', file));
    if (query.kind === 'Request' && query.params.operationKind === 'query') {
      queries.push({
        query: query,
        variables: query.operation.argumentDefinitions.map((x) => x.name),
        name: query.operation.name,
        id: query.params.id,
      });
    }
  }
  console.log(
    'all',
    queries.map((x) => x.name),
  );
  return queries;
}

const queryChainScript = `
export function getSubdomainVariables(result) {
  if (result.IssueSubscription) {
    return {
      subdomain:
        result.IssueSubscription.data.github.issuesEvent.issue.author.login,
    };
  } else {
    return {
      subdomain:
        result.IssueCommentSubscription.data.github.issueCommentEvent.issue
          .author.login,
    };
  }
}
export function getIssueNumberVariables(result) {
  if (result.IssueSubscription) {
    return {
      issueNumber:
        result.IssueSubscription.data.github.issuesEvent.issue.number,
    };
  } else {
    return {
      issueNumber:
        result.IssueCommentSubscription.data.github.issueCommentEvent.issue
          .number,
    };
  }
}

export function getAuthorDocIds(result) {
  return result.AuthorDocIds.data.oneGraph.identity;
}

export function getNumberDocIds(result) {
  return result.NumberDocIds.data.oneGraph.identity;
}
`;

const queryChainDoc = /* GraphQL */ `
  subscription IssueSubscription($repoOwner: String!, $repoName: String!) {
    github(webhookUrl: "https://websmee.com/hook/essay-dev-evict-cache") {
      issuesEvent(input: {repoOwner: $repoOwner, repoName: $repoName}) {
        issue {
          number
          author {
            login
          }
        }
      }
    }
  }

  subscription IssueCommentSubscription(
    $repoOwner: String!
    $repoName: String!
  ) {
    github(webhookUrl: "https://websmee.com/hook/essay-dev-evict-cache") {
      issueCommentEvent(input: {repoOwner: $repoOwner, repoName: $repoName}) {
        issue {
          number
          author {
            login
          }
        }
      }
    }
  }

  mutation EvictCacheMutation(
    $appId: String!
    $docId: String!
    $variables: JSON
    $dashboardToken: String!
  ) {
    oneGraph(auths: {onegraphToken: $dashboardToken}) {
      evictCachedPersistedQueryResults(
        input: {appId: $appId, docId: $docId, variables: $variables}
      ) {
        docId
      }
    }
  }

  query DocIds($docIds: JSON!) {
    oneGraph {
      identity(input: $docIds)
    }
  }

  mutation EvictOnIssueChangeChain(
    $appId: JSON!
    $repoOwner: JSON!
    $repoName: JSON!
    $script: String!
    $byAuthorDocIds: JSON!
    $byNumberDocIds: JSON!
    $dashboardToken: JSON!
  ) {
    oneGraph {
      executeChain(
        input: {
          script: $script
          requests: [
            {
              operationName: "IssueSubscription"
              id: "IssueSubscription"
              variables: [
                {name: "repoOwner", value: $repoOwner}
                {name: "repoName", value: $repoName}
              ]
            }
            {
              operationName: "DocIds"
              id: "AuthorDocIds"
              variables: [{name: "docIds", value: $byAuthorDocIds}]
            }
            {
              operationName: "DocIds"
              id: "NumberDocIds"
              variables: [{name: "docIds", value: $byNumberDocIds}]
            }
            {
              operationName: "EvictCacheMutation"
              id: "EvictCacheMutationForAuthorDocIds"
              variables: [
                {name: "appId", value: $appId}
                {name: "dashboardToken", value: $dashboardToken}
              ]
              argumentDependencies: [
                {
                  name: "variables"
                  functionFromScript: "getSubdomainVariables"
                  fromRequestIds: ["IssueSubscription"]
                  ifMissing: SKIP
                }
                {
                  name: "docId"
                  functionFromScript: "getAuthorDocIds"
                  fromRequestIds: ["AuthorDocIds"]
                  ifList: EACH
                }
              ]
            }
            {
              operationName: "EvictCacheMutation"
              id: "EvictCacheMutationForNumberDocIds"
              variables: [
                {name: "appId", value: $appId}
                {name: "dashboardToken", value: $dashboardToken}
              ]
              argumentDependencies: [
                {
                  name: "variables"
                  functionFromScript: "getIssueNumberVariables"
                  fromRequestIds: ["IssueSubscription"]
                  ifMissing: SKIP
                }
                {
                  name: "docId"
                  functionFromScript: "getNumberDocIds"
                  fromRequestIds: ["NumberDocIds"]
                  ifList: EACH
                }
              ]
            }
          ]
        }
      ) {
        results {
          request {
            id
          }
          result
        }
      }
    }
  }

  mutation EvictOnIssueCommentChain(
    $appId: JSON!
    $repoOwner: JSON!
    $repoName: JSON!
    $script: String!
    $byNumberDocIds: JSON!
    $dashboardToken: JSON!
  ) {
    oneGraph {
      executeChain(
        input: {
          script: $script
          requests: [
            {
              id: "IssueCommentSubscription"
              variables: [
                {name: "repoOwner", value: $repoOwner}
                {name: "repoName", value: $repoName}
              ]
            }
            {
              operationName: "DocIds"
              id: "NumberDocIds"
              variables: [{name: "docIds", value: $byNumberDocIds}]
            }
            {
              operationName: "EvictCacheMutation"
              id: "EvictCacheMutationForNumberDocIds"
              variables: [
                {name: "appId", value: $appId}
                {name: "dashboardToken", value: $dashboardToken}
              ]
              argumentDependencies: [
                {
                  name: "variables"
                  functionFromScript: "getIssueNumberVariables"
                  fromRequestIds: ["IssueCommentSubscription"]
                  ifMissing: SKIP
                }
                {
                  name: "docId"
                  functionFromScript: "getNumberDocIds"
                  fromRequestIds: ["NumberDocIds"]
                  ifList: EACH
                }
              ]
            }
          ]
        }
      ) {
        results {
          request {
            id
          }
          result
        }
      }
    }
  }
`;

async function main(config) {
  const queries = getAllQueries();
  const withSubdomain = queries
    .filter((x) => x.variables.includes('subdomain'))
    .map((x) => x.id);
  const withNumber = queries
    .filter((x) => x.variables.includes('issueNumber'))
    .map((x) => x.id);

  const variables = {
    appId: APP_ID,
    repoOwner: REPO_OWNER,
    repoName: REPO_NAME,
    script: queryChainScript,
    byAuthorDocIds: withSubdomain,
    byNumberDocIds: withNumber,
    dashboardToken: DASHBOARD_TOKEN,
  };

  const issuesRes = await fetch(
    `https://serve.onegraph.com/graphql?app_id=${APP_ID}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: queryChainDoc,
        operationName: 'EvictOnIssueChangeChain',
        variables,
      }),
    },
  );

  const issuesJson = await issuesRes.json();
  if (issuesJson.errors) {
    console.error('Error creating EvictOnIssueChangeChain', json.errors);
    throw new Error(issuesJson.errors[0].message);
  }

  const commentsRes = await fetch(
    `https://serve.onegraph.com/graphql?app_id=${APP_ID}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        query: queryChainDoc,
        operationName: 'EvictOnIssueCommentChain',
        variables,
      }),
    },
  );

  const commentsJson = await commentsRes.json();
  if (commentsJson.errors) {
    console.error('Error creating EvictOnIssueCommentChain', json.errors);
    throw new Error(issuesJson.errors[0].message);
  }
}

const argv = yargs
  .usage(
    'Setup subscription to clear cache on issue change or issue comment change.',
  )
  .help().argv;

main(argv).catch((error) => {
  console.error(String(error.stack || error));
  process.exit(1);
});
