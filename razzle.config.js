module.exports = {
  plugins: [WebpackPerformanceHintsRazzlePlugin({})],
};

function WebpackPerformanceHintsRazzlePlugin(pluginOptions) {
  return function WebpackPerformanceHintsRazzlePluginFunc(config) {
    return {
      ...config,
      performance: {
        ...config.performance,
        assetFilter: function(assetFilename) {
          return false;
        },
      },
    };
  };
}
