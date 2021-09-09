"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_version_1 = require("./check-version");
const ora_1 = require("ora");
const rm = require("rimraf");
const path = require("path");
const config_1 = require("./config");
const webpack = require("webpack");
const produ_1 = require("./config/webpack/produ");
const chalk = require("chalk");
check_version_1.default();
process.env.NODE_ENV = 'production';
let spinner = ora_1.default('编译');
spinner.start();
rm(path.join(config_1.default.build.assetsRoot, config_1.default.build.assetsSubDirectory), err => {
    if (err)
        throw err;
    webpack(produ_1.default, (err, stats) => {
        spinner.stop();
        if (err)
            throw err;
        console.log(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }));
        if (stats.hasErrors()) {
            console.log(chalk.red('  编译失败.\n'));
            process.exit(1);
        }
        console.log(chalk.cyan('  编译完成.\n'));
    });
});
