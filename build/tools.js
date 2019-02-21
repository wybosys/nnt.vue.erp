const fs = require('fs')
const path = require('path')

function StopDevServer() {
  if (fs.existsSync('run/dev-server.pid')) {
    let buf = fs.readFileSync('run/dev-server.pid')
    let pid = buf.toString()
    try {
      process.kill(parseInt(pid))
    } catch (err) {
    }
    fs.unlinkSync('run/dev-server.pid')
  }
}

function SaveDevServer() {
  if (!fs.existsSync('run'))
    fs.mkdirSync('run')
  fs.writeFileSync('run/dev-server.pid', process.pid)
}

function SetObjectValue(result, group, key, value) {
  if (!(group in result)) {
    result[group] = {}
  }
  result[group][key] = value
}

function GenRoutes(srcdir, outputfile) {
  // 默认输出到src/router/index.ts中
  // 默认组件保存在src/components中

  // { path: filepath }
  let routes = {}

  // 列出所有目录中的组件
  ListRoutesInDirectory('src/' + srcdir, '', routes)

  let imports = []
  let defs = []

  for (let key in routes) {
    let cfg = routes[key]
    let name = key.replace(/\//g, '_')
    imports.push('const ' + name + ' = () => import("../components' + cfg.file + '")')
    let def = "\t\t{"
    let arr = [
      "\n\t\t\tpath: '" + key + "'",
      "\n\t\t\tcomponent: " + name,
      "\n\t\t\tname: '" + name + "'"
    ]

    if (cfg.module) {
      arr.push("\n\t\t\tmodule: true")
    }

    def += arr.join(',') + "\n\t\t}"
    defs.push(def)
  }

  // 如果是二级目录，则需要生成额外的router
  /*
  if (fs.existsSync('devops.json')) {
    let devops = JSON.parse(fs.readFileSync('devops.json'))
    let path = devops.path.substr(15)
    for (let key in routes) {
      let name = key.replace(/\//g, '_')
      key = path + key
      defs.push("\t{\n\t\tpath: '" + key + "',\n\t\tcomponent: " + name + ",\n\t\tname: 'devops" + name + "'\n\t}")
    }
  }
  */

  content = imports.join('\n')
  content += '\n\n'
  content += 'export default {\n'
  content += '\troutes: [\n'
  content += defs.join(',\n')
  content += ']\n'
  content += '}\n'

  // 保存
  fs.writeFileSync('src/router/' + outputfile + '.ts', content)
}

function GenRoutesInSite(srcdir, site) {
  // 默认输出到src/router/index.ts中
  // 默认组件保存在src/components中

  // { path: filepath }
  let routes = {}

  // 列出所有目录中的组件
  ListRoutesInDirectory('src/' + srcdir, '', routes, site)

  let imports = []
  let defs = []

  for (let key in routes) {
    let cfg = routes[key]
    let name = key.replace(/\//g, '_')
    imports.push('const ' + name + ' = () => import("../sites/' + site + cfg.file + '")')
    defs.push("\t{\n\t\tpath: '" + key + "',\n\t\tcomponent: " + name + ",\n\t\tname: '" + name + "'\n\t}")
  }

  // 如果是二级目录，则需要生成额外的router
  /*
  if (fs.existsSync('devops.json')) {
    let devops = JSON.parse(fs.readFileSync('devops.json'))
    let path = devops.path.substr(15)
    for (let key in routes) {
      let name = key.replace(/\//g, '_')
      key = path + key
      defs.push("\t{\n\t\tpath: '" + key + "',\n\t\tcomponent: " + name + ",\n\t\tname: 'devops" + name + "'\n\t}")
    }
  }
  */

  content = imports.join('\n')
  content += '\n\n'
  content += 'export default [\n'
  content += defs.join(',\n')
  content += '\n]\n'

  // 保存
  fs.writeFileSync('src/router/' + site + '.ts', content)
}

function UppercaseFirst(str) {
  if (!str || str.length == 0)
    return str
  return str[0].toUpperCase() + str.substr(1)
}

function ListRoutesInDirectory(dir, cur, result, site) {
  let cfg = dir + '/config.json'
  let curpath = cur;

  if (fs.existsSync(cfg)) {
    let cfgobj = JSON.parse(fs.readFileSync(cfg))
    let rootname = UppercaseFirst(path.basename(cur))

    // 如果定义了path，则使用config的定义
    if (cfgobj.path)
      curpath = cfgobj.path;

    if (fs.existsSync(dir + '/' + rootname + '.vue')) {
      SetObjectValue(result, curpath, 'file', cur + '/' + rootname + '.vue')
      if (cfgobj.default) {
        SetObjectValue(result, path.dirname(cur), 'file', cur + '/' + rootname + '.vue')
      }

      SetObjectValue(result, curpath, 'priority', cfgobj.priority >= 0 ? cfgobj.priority : 9999)
      SetObjectValue(result, curpath, 'module', true)
    }
  }

  // 如果是site模式，则必须生成根
  if (site) {
    let rootname = UppercaseFirst(site)
    SetObjectValue(result, '/', 'file', cur + '/' + rootname + '.vue')
  }

  fs.readdirSync(dir).forEach(each => {
    let st = fs.statSync(dir + '/' + each)
    if (st.isDirectory()) {
      ListRoutesInDirectory(dir + '/' + each, cur + '/' + each, result)
    } else {
      if (path.extname(each) == ".vue") {
        let name = path.basename(each, ".vue").toLowerCase()
        SetObjectValue(result, curpath + '/' + name, 'file', cur + '/' + each)
      }
    }
  })
}

function GenSites() {
  dir = 'sites'
  sites = []
  defaultsite = null
  fs.readdirSync('src/' + dir).forEach(each => {
    let st = fs.statSync('src/' + dir + '/' + each)
    if (st.isDirectory()) {
      sites.push(each)
      GenRoutesInSite(dir + '/' + each, each)
      // 读取配置
      let cfg = 'src/' + dir + '/' + each + '/config.json'
      if (fs.existsSync(cfg)) {
        let cfgobj = JSON.parse(fs.readFileSync(cfg))
        if (cfgobj.default)
          defaultsite = each
      }
    }
  })

  // 生成基础的routers，来支持多站点
  let content = [];
  // 导入对象
  content.push('const _ = () => import("../nnt/sites/Index.vue")')
  sites.forEach(site => {
    content.push('const ' + site + ' = () => import("./' + site + '")')
  })

  // 生成路由配置
  content.push('')
  content.push('export default {')

  // 生成gateway路由配置
  content.push('\troutes: [')
  content.push("\t\t{\n\t\t\tpath: '/',\n\t\t\tcomponent: _,\n\t\t\tname: '_site_'\n\t\t},")
  content.push("\t\t{\n\t\t\tpath: '/:site',\n\t\t\tcomponent: _,\n\t\t\tname: '_site__'\n\t\t},")
  content.push("\t\t{\n\t\t\tpath: '*',\n\t\t\tcomponent: _,\n\t\t\tname: '_any_'\n\t\t}")
  content.push('\t],')

  // 生成sites的配置
  content.push('\tsites: {')
  let sitecontents = []
  sites.forEach(each => {
    sitecontents.push('\t\t' + each + ': ' + each)
  })
  if (defaultsite && !('default' in sites))
    sitecontents.push('\t\tdefault: ' + defaultsite)
  content.push(sitecontents.join(',\n'))
  content.push('\t}')

  content.push('}')
  fs.writeFileSync('src/router/index.ts', content.join('\n'))
}

function GetDevopsDomain() {
  let devops = JSON.parse(fs.readFileSync('devops.json'))
  let path = devops.path.substr(15)
  return path
}

if (process.argv.indexOf('stop') != -1) {
  StopDevServer()
} else if (process.argv.indexOf('routes') != -1) {
  GenRoutes('components', 'index')
} else if (process.argv.indexOf('sites') != -1) {
  GenSites()
}

module.exports = {
  StopDevServer,
  SaveDevServer,
  GetDevopsDomain
}
