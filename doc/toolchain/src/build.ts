import checkVersion from './check-version'
import ora from 'ora'
import rm = require('rimraf')
import path = require('path')
import config from './config'
import webpack = require('webpack')
import produWebpackConfig from './config/webpack/produ'
import chalk = require('chalk')

// 检查依赖版本
checkVersion()

// 默认编译类型
process.env.NODE_ENV = 'production'

// 启动任务
let spinner = ora('编译生产').start()

// 删除旧文件并编译
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err)
        throw err

    webpack(produWebpackConfig, (err, stats) => {
        spinner.stop()
        if (err)
            throw err

        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }))

        if (stats.hasErrors()) {
            console.log(chalk.red('  编译失败.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  编译完成.\n'))
    })
})