import child_process = require('child_process')
import { clean, satisfies } from 'semver'
import shell = require('shelljs')
import chalk = require('chalk')
import { LoadJson } from './utils'

function exec(cmd: string) {
  return child_process.execSync(cmd).toString().trim()
}

let package_json = LoadJson(__dirname, '../package.json')

const VersionRequirements = [
  {
    name: 'node',
    currentVersion: clean(process.version) ?? "",
    versionRequirement: package_json.engines.node
  }
]

if (shell.which('npm')) {
  VersionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: package_json.engines.npm
  })
}

export default () => {
  let warnings: string[] = []
  VersionRequirements.forEach(e => {
    if (!satisfies(e.currentVersion, e.versionRequirement)) {
      warnings.push(`${e.name}: ${chalk.red(e.currentVersion)} 版本必须为 ${chalk.green(e.versionRequirement)}`)
    }
  })

  if (warnings.length) {
    console.log()
    console.log(chalk.yellow('必须安装如下模块:'))
    console.log()
    warnings.forEach(e => {
      console.log(`\t${e}`)
    })
    console.log()
    process.exit()
  }
}
