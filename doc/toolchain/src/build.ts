import checkVersion from './check-version'
import config from './config'
import produWebpackConfig from './config/webpack/produ'
import rmr = require('rimraf');
import path = require('path');
import webpack = require('webpack');
import chalk = require('chalk');

// 检查依赖版本
checkVersion()

// 默认编译类型
process.env.NODE_ENV = 'production'

// 删除旧文件并编译
rmr(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err)
    throw err

  webpack(produWebpackConfig, (err, stats) => {
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
