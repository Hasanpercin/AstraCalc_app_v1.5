const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expo router için gerekli
config.transformer.unstable_allowRequireContext = true;

module.exports = config;
