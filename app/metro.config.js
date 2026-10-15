// Inclui a pasta core/ (regras do app, fora de app/) no empacotador.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [...(config.watchFolders ?? []), path.resolve(__dirname, '../core')];

module.exports = config;
