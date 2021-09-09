import path = require('path')
import { merge } from 'webpack-merge'
import baseWebpackConfig from './base'
import { StyleLoaders, AssetsPath } from '../../utils'
import config from '../../config'
import TerserPlugin = require('terser-webpack-plugin')
import { VueLoaderPlugin } from 'vue-loader'
import webpack = require('webpack')
import config_produ from '../../config/produ'
import ExtractTextPlugin = require('extract-text-webpack-plugin')
import CopyWebpackPlugin = require('copy-webpack-plugin')
import HtmlWebpackPlugin = require('html-webpack-plugin')
import OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
import CompressionWebpackPlugin = require('compression-webpack-plugin')
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

let produWebpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    entry: {
        vendors: ['vue', 'vue-router'],
    },
    module: {
        rules: StyleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: AssetsPath('js/[name].[chunkhash].js'),
        chunkFilename: AssetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
            }),
        ],
        providedExports: true,
        usedExports: true,
        sideEffects: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        moduleIds: 'hashed',
        splitChunks: {
            chunks: "initial",
            minSize: 0,
            maxAsyncRequests: 1,
            maxInitialRequests: 1,
            cacheGroups: {
                common: {
                    chunks: 'all',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name: 'common'
                }
            }
        },
        runtimeChunk: {
            // 提取webpack运行时的代码
            name: 'manifest'
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env': config_produ
        }),
        new ExtractTextPlugin({
            filename: AssetsPath('css/[name].[md5:contenthash:hex:20].css'),
            allChunks: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap ? {
                safe: true,
                map: {
                    inline: false
                }
            } : {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'auto'
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

if (config.build.productionGzip) {
    produWebpackConfig.plugins!.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        filename: '[path][base].gz[query]',
        test: new RegExp(`\\.(${config.build.productionGzipExtensions.join('|')})$`),
        threshold: 10240,
        minRatio: 0.8
    }))
}

if (config.build.bundleAnalyzerReport) {
    produWebpackConfig.plugins!.push(new BundleAnalyzerPlugin())
}

export default produWebpackConfig
