module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // No longer needed - included in babel-preset-expo for SDK 50+
    ],
  };
};
