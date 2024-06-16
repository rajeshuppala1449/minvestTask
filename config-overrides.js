const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "querystring": require.resolve("querystring-es3")
    };
    return config;
  }
);
