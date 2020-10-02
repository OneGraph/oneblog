const fetch = require('node-fetch');
const yargs = require('yargs');

require('dotenv').config();

const REPO_OWNER =
  process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ||
  process.env.RAZZLE_GITHUB_REPO_OWNER ||
  process.env.VERCEL_GITHUB_ORG;
const REPO_NAME =
  process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ||
  process.env.RAZZLE_GITHUB_REPO_NAME ||
  process.env.VERCEL_GITHUB_REPO;

const TOKEN = process.env.OG_GITHUB_TOKEN;

const APP_ID =
  process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID || process.env.RAZZLE_ONEGRAPH_APP_ID;

function ensureConfig() {
  if (!REPO_OWNER) {
    console.warn(
      "Can't ensure publish label on repo, unable to determine repo owner. Add NEXT_PUBLIC_GITHUB_REPO_OWNER to the environment variables.",
    );
    return;
  }
  if (!REPO_NAME) {
    console.warn(
      "Can't ensure publish label on repo, unable to determine repo name. Add NEXT_PUBLIC_GITHUB_REPO_NAME to the environment variables.",
    );
    return;
  }
  if (!TOKEN) {
    console.warn(
      "Can't ensure publish label on repo, unable to write to GitHub. Add OG_GITHUB_TOKEN to the environment variables.",
    );
    return;
  }
  if (!APP_ID) {
    console.warn(
      "Can't ensure publish label on repo, unable to determine OneGraph appId. Add NEXT_PUBLIC_ONEGRAPH_APP_ID to the environment variables.",
    );
    return;
  }
  return {
    repoOwner: REPO_OWNER,
    repoName: REPO_NAME,
    token: TOKEN,
    appId: APP_ID,
  };
}

const createPublishLabelMutation = /* GraphQL */ `
  mutation CreatePublishLabelMutation($path: String!) {
    gitHub {
      makeRestCall {
        post(
          path: $path
          jsonBody: {
            name: "Publish"
            color: "1997c6"
            description: "Add this label to an issue to publish it on the blog"
          }
        ) {
          jsonBody
        }
      }
    }
  }
`;

const labelsQuery = /* GraphQL */ `
  query GitHubLabelsQuery($repoOwner: String!, $repoName: String!) {
    gitHub {
      repository(owner: $repoOwner, name: $repoName) {
        labels(first: 100) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

async function gqlFetch({appId, token, query, variables}) {
  const response = await fetch(
    `https://serve.onegraph.com/graphql?app_id=${appId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  const json = await response.json();
  if (json.errors || !json.data) {
    const msg = json.errors[0] && json.errors[0].message;
    throw new Error(msg || 'There was an error running the query');
  } else {
    return json.data;
  }
}

async function ensureLabel() {
  const config = ensureConfig();
  if (!config) {
    return;
  }
  try {
    const labelData = await gqlFetch({
      appId: config.appId,
      token: config.token,
      query: labelsQuery,
      variables: {repoName: config.repoName, repoOwner: config.repoOwner},
    });
    if (
      labelData &&
      labelData.gitHub &&
      labelData.gitHub.repository &&
      labelData.gitHub.repository.labels &&
      labelData.gitHub.repository.labels.nodes
    ) {
      const nodes = labelData.gitHub.repository.labels.nodes;
      if (nodes.find((n) => n.name === 'Publish' || n.name === 'publish')) {
        console.log('repo has publish label');
        return;
      } else {
        const createLabelData = await gqlFetch({
          token: config.token,
          appId: config.appId,
          query: createPublishLabelMutation,
          variables: {
            path: `/repos/${config.repoOwner}/${config.repoName}/labels`,
          },
        });
        if (
          createLabelData &&
          createLabelData.gitHub &&
          createLabelData.gitHub.makeRestCall &&
          createLabelData.gitHub.makeRestCall.post &&
          createLabelData.gitHub.makeRestCall.post.jsonBody &&
          createLabelData.gitHub.makeRestCall.post.jsonBody &&
          createLabelData.gitHub.makeRestCall.post.jsonBody.name === 'Publish'
        ) {
          console.log('Created label on repo');
        } else {
          console.warn(
            'There was an error adding the publish label to the repo',
          );
        }
      }
    }
  } catch (e) {
    console.log(
      "Can't ensure publish label on repo, there was an error making the query.",
      e.message,
    );
  }
}

async function main(config) {
  await ensureLabel();
}

const argv = yargs.usage('Ensure the publish label exists on the repo').help()
  .argv;

main(argv).catch((error) => {
  console.error(String(error.stack || error));
  process.exit(1);
});
