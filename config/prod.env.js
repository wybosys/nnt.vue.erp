'use strict'
const tools = require('../build/tools')

module.exports = {
  NODE_ENV: '"production"',
  DEVOPS_DOMAIN: JSON.stringify(tools.GetDevopsDomain())
}
