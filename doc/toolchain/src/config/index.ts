import path from 'path'
import { CONFIG, GetDevopsDomain } from '../tools'

export default {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {},

        host: CONFIG.CONFIG_DEV.host,
        port: CONFIG.CONFIG_DEV.port,
        autoOpenBrowser: false,
        errorOverlay: CONFIG.verbose,
        notifyOnErrors: CONFIG.verbose,
        poll: false,

        devtool: 'cheap-module-eval-source-map',
        cacheBusting: CONFIG.sourcemap,
        cssSourceMap: CONFIG.sourcemap
    },

    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: GetDevopsDomain() + '/',
        productionSourceMap: false,
        devtool: '#source-map',
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    }
}
