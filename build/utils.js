"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendlyErrorsHandler = exports.StyleLoaders = exports.CssLoaders = exports.AssetsPath = exports.LoadJson = void 0;
const path = require("path");
const config_1 = require("./config");
const fs = require("fs");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const notifier = require("node-notifier");
const friendly_errors_webpack_plugin_1 = require("friendly-errors-webpack-plugin");
function LoadJson(dir, file) {
    let af = path.resolve(dir, file);
    return JSON.parse(fs.readFileSync(af).toLocaleString());
}
exports.LoadJson = LoadJson;
let package_json = LoadJson(__dirname, '../package.json');
function AssetsPath(pth) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config_1.default.build.assetsSubDirectory : config_1.default.dev.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, pth);
}
exports.AssetsPath = AssetsPath;
function FindAllScssFiles(dirPath) {
    let ret = [];
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(function (item, index) {
            let nowDir = path.resolve(dirPath, item);
            let stat = fs.statSync(nowDir);
            if (stat.isDirectory() === true) {
                ret.concat(FindAllScssFiles(nowDir));
            }
            else {
                if (path.extname(nowDir) === '.scss') {
                    ret.push(nowDir);
                }
            }
        });
    }
    else {
        console.warn(`${dirPath}该目录不存在`);
    }
    return ret;
}
function CssLoaders(options = {}) {
    let cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };
    let postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };
    let px2remLoader = {
        loader: 'px2rem-loader',
        options: {
            remUnit: 75
        }
    };
    function GenerateLoaders(loader = "", loaderOptions = {}) {
        let ret = [cssLoader];
        if (options.usePostCSS)
            ret.push(postcssLoader);
        if (loader) {
            ret.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }
        if (options.extract) {
            ret = ExtractTextPlugin.extract({
                use: ret,
                fallback: 'vue-style-loader'
            });
        }
        else {
            ret.push('vue-style-loader');
        }
        return ret;
    }
    let scssFiles = FindAllScssFiles(path.resolve(__dirname, '../src'));
    function GenerateSassResourceLoader() {
        var ret = [
            cssLoader,
            px2remLoader,
            'postcss-loader',
            'sass-loader',
            {
                loader: 'sass-resources-loader',
                options: {
                    resources: scssFiles
                }
            }
        ];
        if (options.extract) {
            ret = ExtractTextPlugin.extract({
                use: ret,
                fallback: 'vue-style-loader',
                publicPath: '../../'
            });
        }
        else {
            ret.push('vue-style-loader');
        }
        return ret;
    }
    return {
        css: GenerateLoaders(),
        postcss: GenerateLoaders(),
        less: GenerateLoaders('less'),
        sass: GenerateSassResourceLoader(),
        scss: GenerateSassResourceLoader(),
        stylus: GenerateLoaders('stylus'),
        styl: GenerateLoaders('stylus'),
        ts: [],
        tsx: []
    };
}
exports.CssLoaders = CssLoaders;
function StyleLoaders(options = {}) {
    const output = [];
    const loaders = CssLoaders(options);
    for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return output;
}
exports.StyleLoaders = StyleLoaders;
function FriendlyErrorsHandler(severity, errors) {
    if (severity != friendly_errors_webpack_plugin_1.Severity.Error)
        return;
    notifier.notify({
        title: package_json.name,
        message: errors,
        subtitle: severity,
        icon: path.join(__dirname, 'logo.png')
    });
}
exports.FriendlyErrorsHandler = FriendlyErrorsHandler;
