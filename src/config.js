// @flow

export type Config = {
  repoName: string,
  repoOwner: string,
  appId: string,
  title: ?string,
  description: ?string,
  defaultLogin: ?string,
};

function ensureEnv(s, variable: string): string {
  if (!s) {
    throw new Error(`Expected environment variable \`${variable}\` to be set.`);
  }
  return s;
}

const config: Config = {
  // Owner of the repo that OneBlog should pull issues from
  repoOwner: ensureEnv(
    process.env.RAZZLE_GITHUB_REPO_OWNER,
    'RAZZLE_GITHUB_REPO_OWNER',
  ),
  // Name of the repo that OneBlog should pull issues from
  repoName: ensureEnv(
    process.env.RAZZLE_GITHUB_REPO_NAME,
    'RAZZLE_GITHUB_REPO_NAME',
  ),
  // Your OneGraph app id
  appId: ensureEnv(
    process.env.RAZZLE_ONEGRAPH_APP_ID,
    'RAZZLE_ONEGRAPH_APP_ID',
  ),
  title: process.env.RAZZLE_TITLE,
  description: process.env.RAZZLE_DESCRIPTION,
  defaultLogin: process.env.RAZZLE_DEFAULT_GITHUB_LOGIN,
};

export default config;
