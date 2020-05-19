'use strict';

const path = require('path');
const tools = require('../build/tools');

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    host: tools.CONFIG.CONFIG_DEV.host,
    port: tools.CONFIG.CONFIG_DEV.port,
    autoOpenBrowser: false,
    errorOverlay: tools.CONFIG.verbose,
    notifyOnErrors: tools.CONFIG.verbose,
    poll: false,

    devtool: 'cheap-module-eval-source-map',
    cacheBusting: tools.CONFIG.sourcemap,
    cssSourceMap: tools.CONFIG.sourcemap
  },

  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: tools.GetDevopsDomain() + '/',
    productionSourceMap: true,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
