import webpack = require('webpack');
import webpackDevServer = require('webpack-dev-server');
import path = require('path');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CopyWebpackPlugin = require('copy-webpack-plugin');
import portfinder = require('portfinder');
import FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import {merge} from 'webpack-merge'
import baseWebpackConfig from './base'
import config from '../../config'
import config_dev from '../../config/dev'
import {FriendlyErrorsHandler, StyleLoaders} from '../../utils'
import {VueLoaderPlugin} from 'vue-loader'

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let devWebpackServerConfig: webpackDevServer.Configuration = {
  clientLogLevel: "warn",
  overlay: config.dev.errorOverlay
    ? {warnings: false, errors: true}
    : false,
  historyApiFallback: {
    rewrites: [
      {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
    ],
  },
  publicPath: config.dev.assetsPublicPath,
  watchOptions: {
    poll: config.dev.poll
  },
  hot: true,
  compress: true,
  host: HOST || config.dev.host,
  port: PORT || config.dev.port,
  open: config.dev.autoOpenBrowser,
  proxy: config.dev.proxyTable
}

let devWebpackConfig = merge(baseWebpackConfig, <webpack.Configuration>{
  mode: 'development',
  module: {
    rules: StyleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true
  },
  devtool: config.dev.devtool,
  devServer: devWebpackServerConfig,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config_dev
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          filter: pth => !pth.startsWith('.')
        },
        {
          from: path.resolve(__dirname, '../src/router'),
          to: config.dev.assetsSubDirectory,
          filter: pth => !pth.endsWith('.ts')
        }
      ]
    })
  ]
})

export default new Promise((resolve, reject) => {
  portfinder.basePort = Number(process.env.PORT) || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
      return
    }

    // publish the new Port, necessary for e2e tests
    process.env.PORT = port.toString()
    // add port to devServer config
    devWebpackServerConfig.port = port

    devWebpackConfig.plugins!.push(new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`运行地址: http://${devWebpackServerConfig.host}:${port}`],
        notes: []
      },
      onErrors: (severity, errors) => {
        if (config.dev.notifyOnErrors)
          FriendlyErrorsHandler(severity, errors)
      }
    }))
  })

  resolve(devWebpackConfig)
})
