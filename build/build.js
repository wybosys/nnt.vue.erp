"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_version_1 = require("./check-version");
const ora_1 = require("ora");
const rimraf_1 = require("rimraf");
const path_1 = require("path");
const config_1 = require("./config");
check_version_1.default();
process.env.NODE_ENV = 'production';
let spinner = ora_1.default('编译');
spinner.start();
rimraf_1.default(path_1.default.join(config_1.default.build.assetsRoot, config_1.default.build.assetsSubDirectory), err => {
    if (err)
        throw err;
});
