import path from 'path'
import config from './config'
import fs from 'fs'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import notifier from 'node-notifier'
import package_json from '../package.json'
import { RuleSetRule } from 'webpack'
import { Severity } from 'friendly-errors-webpack-plugin'

interface NewLoader {
    loader: string;
    options?: { [name: string]: any } | undefined;
}
type Loader = string | NewLoader;

export function AssetsPath(pth: string) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, pth)
}

function FindAllScssFiles(dirPath: string): string[] {
    let ret: string[] = []
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(function (item, index) {
            let nowDir = path.resolve(dirPath, item);
            let stat = fs.statSync(nowDir);
            if (stat.isDirectory() === true) {
                ret.concat(FindAllScssFiles(nowDir));
            } else {
                if (path.extname(nowDir) === '.scss') {
                    ret.push(nowDir);
                }
            }
        });
    } else {
        console.warn(`${dirPath}该目录不存在`);
    }
    return ret;
}

export interface CssLoadersOption {
    sourceMap?: boolean
    extract?: boolean
    usePostCSS?: boolean
}

export function CssLoaders(options: CssLoadersOption = {}) {
    let cssLoader: Loader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    let postcssLoader: Loader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    };

    let px2remLoader: Loader = {
        loader: 'px2rem-loader',
        // loader: 'postcss-px2rem',
        options: {
            remUnit: 75
        }
    }

    // generate loader string to be used with extract text plugin
    function GenerateLoaders(loader: string = null, loaderOptions = {}): Loader[] {
        let ret = [cssLoader]
        if (options.usePostCSS)
            ret.push(postcssLoader)

        if (loader) {
            ret.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            ret = ExtractTextPlugin.extract({
                use: ret,
                fallback: 'vue-style-loader'
            });
        } else {
            ret.push('vue-style-loader')
        }
        return ret
    }

    let scssFiles = FindAllScssFiles(path.resolve(__dirname, '../src'));

    function GenerateSassResourceLoader() {
        var ret: Loader[] = [
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
        } else {
            ret.push('vue-style-loader');
        }
        return ret;
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: GenerateLoaders(),
        postcss: GenerateLoaders(),
        less: GenerateLoaders('less'),
        // sass: generateLoaders('sass', { indentedSyntax: true }),
        // scss: generateLoaders('sass'),
        sass: GenerateSassResourceLoader(),
        scss: GenerateSassResourceLoader(),
        stylus: GenerateLoaders('stylus'),
        styl: GenerateLoaders('stylus')
    };
}

// Generate loaders for standalone style files (outside of .vue)
export function StyleLoaders(options = {}): RuleSetRule[] {
    const output: RuleSetRule[] = [];
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

export function FriendlyErrorsHandler(severity: Severity, errors: string) {
    if (severity != Severity.Error)
        return;
    notifier.notify({
        title: package_json.name,
        message: errors,
        subtitle: severity,
        icon: path.join(__dirname, 'logo.png')
    });
}