import checkVersion from './check-version'
import ora from 'ora'
import rm from 'rimraf'
import path from 'path'
import config from './config'
import webpack from 'webpack'

// 检查依赖版本
checkVersion()

// 默认编译类型
process.env.NODE_ENV = 'production'

// 启动任务
let spinner = ora('编译')
spinner.start()

// 删除旧文件并编译
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err)
        throw err


})