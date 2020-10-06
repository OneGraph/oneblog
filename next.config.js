module.exports = () => {
  const opts = {
    basePath: process.env.BASE_PATH,
    env: {
      // Backwards compatibility for people migrating from RAZZLE
      NEXT_PUBLIC_SITE_HOSTNAME:
        process.env.NEXT_PUBLIC_SITE_HOSTNAME ||
        process.env.RAZZLE_SITE_HOSTNAME ||
        process.env.URL,
      NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_ONEGRAPH_APP_ID:
        process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID ||
        process.env.RAZZLE_ONEGRAPH_APP_ID,
      NEXT_PUBLIC_GITHUB_REPO_OWNER:
        process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ||
        process.env.RAZZLE_GITHUB_REPO_OWNER ||
        process.env.VERCEL_GITHUB_ORG,
      NEXT_PUBLIC_GITHUB_REPO_NAME:
        process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ||
        process.env.RAZZLE_GITHUB_REPO_NAME ||
        process.env.VERCEL_GITHUB_REPO,
      NEXT_PUBLIC_TITLE:
        process.env.NEXT_PUBLIC_TITLE || process.env.RAZZLE_TITLE,
      NEXT_PUBLIC_DESCRIPTION:
        process.env.NEXT_PUBLIC_DESCRIPTION || process.env.RAZZLE_DESCRIPTION,
      NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID:
        process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID ||
        process.env.RAZZLE_GOOGLE_ANALYTICS_TRACKING_ID,
    },
    experimental: {
      reactMode: 'concurrent',
    },
    async rewrites() {
      return [
        {
          source: '/feed.:ext',
          destination: '/api/feed/:ext',
        },
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
      ];
    },
  };
  if (process.env.NETLIFY) {
    opts.target = 'serverless';
  }
  return opts;
};
