import child_process from 'child_process'
import semver from 'semver'
import package_json from '../package.json'
import shell from 'shelljs'
import chalk from 'chalk'

function exec(cmd: string) {
  return child_process.execSync(cmd).toString().trim()
}

const VersionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version),
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
    if (!semver.satisfies(e.currentVersion, e.versionRequirement)) {
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
