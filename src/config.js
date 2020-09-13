// @flow

export type Config = {
  repoName: string,
  repoOwner: string,
  appId: string,
  title: string,
  description: ?string,
  defaultLogin: ?string,
  siteHostname: string,
};

function ensureEnv(s, variable: string): string {
  if (!s) {
    throw new Error(`Expected environment variable \`${variable}\` to be set.`);
  }
  return s;
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

const config: Config = {
  // Owner of the repo that OneBlog should pull issues from
  repoOwner: ensureEnv(
    process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER,
    'NEXT_PUBLIC_GITHUB_REPO_OWNER',
  ),
  // Name of the repo that OneBlog should pull issues from
  repoName: ensureEnv(
    process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
    'NEXT_PUBLIC_GITHUB_REPO_NAME',
  ),
  // Your OneGraph app id
  appId: ensureEnv(
    process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID,
    'NEXT_PUBLIC_ONEGRAPH_APP_ID',
  ),
  title: process.env.NEXT_PUBLIC_TITLE || 'OneBlog',
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  defaultLogin: process.env.NEXT_PUBLIC_DEFAULT_GITHUB_LOGIN,
  siteHostname: removeTrailingSlash(process.env.NEXT_PUBLIC_SITE_HOSTNAME),
  hideAttribution: process.env.NEXT_PUBLIC_HIDE_ATTRIBUTION,
};

export default config;
