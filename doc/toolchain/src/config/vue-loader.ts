import { CssLoaders } from "../utils";
import config from '../config'

const isProdu = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProdu
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap

let LOADERS = CssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProdu
})
LOADERS['ts'] = 'ts-loader'
LOADERS['tsx'] = 'babel-loader!ts-loader'

export default {
    loaders: LOADERS,
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}