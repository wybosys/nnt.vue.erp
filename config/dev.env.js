'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const tools = require('../build/tools')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEVOPS_DOMAIN: JSON.stringify(tools.GetDevopsDomain())
})
