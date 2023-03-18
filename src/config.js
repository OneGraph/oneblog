// @flow

export type Config = {
  repoName: string,
  repoOwner: string,
  title: string,
  description: ?string,
  defaultLogin: ?string,
  siteHostname: string,
  gaTrackingId: ?string,
  vercelUrl: ?string,
  codeTheme: string,
  displayImageTitleAsCaption: boolean,
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

if (
  !process.env.NEXT_PUBLIC_SITE_HOSTNAME &&
  process.env.NODE_ENV === 'production'
) {
  console.warn(
    'Missing NEXT_PUBLIC_SITE_HOSTNAME environment variable. OpenGraph preview images will be disabled.',
  );
}

function parseBool({
  value,
  defaultValue,
}: {
  value: any,
  defaultValue: boolean,
}): boolean {
  if (value == null) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
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
  title: process.env.NEXT_PUBLIC_TITLE || 'OneBlog',
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  defaultLogin: process.env.NEXT_PUBLIC_DEFAULT_GITHUB_LOGIN,
  siteHostname: removeTrailingSlash(process.env.NEXT_PUBLIC_SITE_HOSTNAME),
  hideAttribution: parseBool({
    value: process.env.NEXT_PUBLIC_HIDE_ATTRIBUTION,
    defaultValue: false,
  }),
  gaTrackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID,
  vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL
    ? removeTrailingSlash(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`)
    : null,
  codeTheme: process.env.NEXT_PUBLIC_CODE_THEME || 'dark-plus',
  displayImageTitleAsCaption: parseBool({
    value: process.env.NEXT_PUBLIC_DISPLAY_IMAGE_TITLE_AS_CAPTION,
    defaultValue: true,
  }),
};

export default config;
