module.exports = () => {
  const opts = {
    env: {
      // Backwards compatibility for people migrating from RAZZLE
      NEXT_PUBLIC_SITE_HOSTNAME:
        process.env.NEXT_PUBLIC_SITE_HOSTNAME ||
        process.env.RAZZLE_SITE_HOSTNAME ||
        process.env.VERCEL_URL
          ? 'https://' + process.env.VERCEL_URL
          : null || process.env.URL,
      NEXT_PUBLIC_ONEGRAPH_APP_ID:
        process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID ||
        process.env.RAZZLE_ONEGRAPH_APP_ID,
      NEXT_PUBLIC_GITHUB_REPO_OWNER:
        process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ||
        process.env.RAZZLE_GITHUB_REPO_OWNER,
      NEXT_PUBLIC_GITHUB_REPO_NAME:
        process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ||
        process.env.RAZZLE_GITHUB_REPO_NAME,
      NEXT_PUBLIC_TITLE:
        process.env.NEXT_PUBLIC_TITLE || process.env.RAZZLE_TITLE,
      NEXT_PUBLIC_DESCRIPTION:
        process.env.NEXT_PUBLIC_DESCRIPTION || process.env.RAZZLE_DESCRIPTION,
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
      ];
    },
    webpack(config, options) {
      config.devtool = 'source-map';

      for (const plugin of config.plugins) {
        if (plugin.constructor.name === 'UglifyJsPlugin') {
          plugin.options.sourceMap = true;
          break;
        }
      }

      if (config.optimization && config.optimization.minimizer) {
        for (const plugin of config.optimization.minimizer) {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.sourceMap = true;
            break;
          }
        }
      }

      return config;
    },
  };
  if (process.env.NETLIFY) {
    opts.target = 'serverless';
  }
  return opts;
};
