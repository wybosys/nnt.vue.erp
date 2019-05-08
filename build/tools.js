const fs = require('fs')
const path = require('path')

// 停止dev用的web服务器
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

// 保存dev运行的服务器信息
function SaveDevServer() {
  if (!fs.existsSync('run'))
    fs.mkdirSync('run')
  fs.writeFileSync('run/dev-server.pid', process.pid)
}

// 保存当前项目解析出的router架构
class RouterNode {

  constructor() {

    // 访问路径
    this.path = null

    // 相对访问路径
    this.rpath = null

    // 节点名
    this.node = null

    // 是否为模块
    this.module = false

    // 优先级
    this.priority = 9999

    // 显示的名称
    this.label = null

    // 页面路径
    this.page = null

    // 是否隐藏
    this.hide = false

    // 父节点
    this.parent = null

    // 是否为默认节点
    this.default = false

    // 子节点
    this.children = []

    // 模块所在目录
    this.dir = ''
  }

  clone() {
    let r = new RouterNode()
    r.path = this.path
    r.rpath = this.rpath
    r.node = this.node
    r.module = this.module
    r.priority = this.priority
    r.label = this.label
    r.page = this.page
    r.hide = this.hide
    r.dir = this.dir
    return r
  }

  hash() {
    let pnodes = [this.node]
    let p = this.parent
    while (p) {
      pnodes.push(p.node)
      p = p.parent
    }
    pnodes.reverse()
    return '_' + pnodes.join('_')
  }

  name() {
    let pnodes = [this.node]
    let p = this.parent
    while (p) {
      pnodes.push(p.node)
      p = p.parent
    }
    pnodes.reverse()
    return pnodes.join('.')
  }

  add(node) {
    node.parent = this
    this.children.push(node)
  }

  all() {
    let r = [this]
    this.children.forEach(e => {
      r = r.concat(e.all())
    })
    r.sort((l, r) => {
      return l.node.localeCompare(r.node)
    })
    return r
  }

  // 解析目录
  static FromDirectory(dir, relv) {
    let r = new RouterNode()

    r.node = path.basename(dir)
    r.dir = dir
    r.path = relv == '' ? '/' : relv
    r.rpath = r.node
    r.label = UppercaseFirst(r.node)
    r.module = true

    // 判断是否存在实现的页面
    if (fs.existsSync(`src/${dir}/${r.label}.vue`)) {
      r.page = r.label
    }

    // 解析配置
    if (fs.existsSync(`src/${dir}/config.json`)) {
      let cfgobj = JSON.parse(fs.readFileSync(`src/${dir}/config.json`))
      if (cfgobj.path)
        r.path = cfgobj.path
      if (cfgobj.rpath)
        r.rpath = cfgobj.rpath
      if (cfgobj.default)
        r.default = true
      if (cfgobj.label)
        r.label = cfgobj.label
      if (cfgobj.priority >= 0)
        r.priority = cfgobj.priority
      if (cfgobj.hide)
        r.hide = true
    }

    // 解析子节点
    fs.readdirSync(`src/${dir}`).forEach(e => {
      let st = fs.statSync(`src/${dir}/${e}`)
      if (st.isDirectory()) {
        let c = RouterNode.FromDirectory(`${dir}/${e}`, `${relv}/${e}`)
        if (!c)
          return

        // 原始子节点
        r.add(c)
      } else if (e.endsWith('.vue')) {
        let c = new RouterNode()
        c.dir = dir
        c.page = c.label = path.basename(e, '.vue')
        c.node = c.page.toLowerCase()
        c.rpath = c.node
        c.path = `${relv}/${c.rpath}`
        r.add(c)
      }
    })

    r.module = r.children.length != 0
    return r
  }
}

function GenRouters(outputfile, ...srcdirs) {
  let imports = []
  let defs = []

  srcdirs.forEach(e => {
    if (!fs.existsSync(`src/${e}`))
      return
    let n = RouterNode.FromDirectory(`${e}`, '')
    n.all().forEach(e => {
      if (!e.page)
        return

      let key = e.hash()
      imports.push(`const ${key} = () => import("../${e.dir}/${e.page}.vue")`)

      let def = "    {"
      let arr = [
        `\n      path: '${e.path}'`,
        `\n      component: ${key}`,
        `\n      name: '${e.name()}'`,
        `\n      label: '${e.label}'`
      ]

      if (e.module) {
        arr.push(`\n      module: true`)
        arr.push(`\n      priority: ${e.priority}`)
        if (e.hide)
          arr.push(`\n      hide: true`)
      }

      def += arr.join(',') + "\n    }"
      defs.push(def)
    })
  })

  let index = []
  index.push('// generated by build/tools.js')
  index.push(imports.join('\n'))
  index.push('\n')
  index.push('export default {')
  index.push('  routes: [')
  index.push(defs.join(',\n'))
  index.push(']')
  index.push('}')
  fs.writeFileSync('src/router/' + outputfile + '.ts', index.join('\n'))
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
    defs.push("  {\n    path: '" + key + "',\n    component: " + name + ",\n    name: '" + name + "'\n  }")
  }

  // 如果是二级目录，则需要生成额外的router
  /*
  if (fs.existsSync('devops.json')) {
    let devops = JSON.parse(fs.readFileSync('devops.json'))
    let path = devops.path.substr(15)
    for (let key in routes) {
      let name = key.replace(/\//g, '_')
      key = path + key
      defs.push(" {\n  path: '" + key + "',\n  component: " + name + ",\n  name: 'devops" + name + "'\n }")
    }
  }
  */

  content = '// generated by build/tools.js\n'
  content += imports.join('\n')
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
        SetObjectValue(result, path.dirname(curpath), 'file', cur + '/' + rootname + '.vue')
      }

      SetObjectValue(result, curpath, 'priority', cfgobj.priority >= 0 ? cfgobj.priority : 9999)
      SetObjectValue(result, curpath, 'label', cfgobj.label ? cfgobj.label : rootname)
      SetObjectValue(result, curpath, 'module', true)

      if (cfgobj.hide)
        SetObjectValue(result, curpath, 'hide', true)
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

function GenSites(dir) {
  sites = []
  defaultsite = null

  fs.readdirSync(`src/${dir}`).forEach(each => {
    let st = fs.statSync(`src/${dir}/${each}`)
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
  content.push('// generated by build/tools.js')

  // 导入对象
  content.push('const _ = () => import("../nnt/sites/Index.vue")')
  sites.forEach(site => {
    content.push('const ' + site + ' = () => import("./' + site + '")')
  })

  // 生成路由配置
  content.push('')
  content.push('export default {')

  // 生成gateway路由配置
  content.push('  routes: [')
  content.push("    {\n      path: '/',\n      component: _,\n      name: '_site_'\n    },")
  content.push("    {\n      path: '/:site',\n      component: _,\n      name: '_site__'\n    },")
  content.push("    {\n      path: '*',\n      component: _,\n      name: '_any_'\n    }")
  content.push('  ],')

  // 生成sites的配置
  content.push('  sites: {')
  let sitecontents = []
  sites.forEach(each => {
    sitecontents.push('    ' + each + ': ' + each)
  })
  if (defaultsite && !('default' in sites))
    sitecontents.push('    default: ' + defaultsite)
  content.push(sitecontents.join(',\n'))
  content.push('  }')

  content.push('}')
  fs.writeFileSync('src/router/index.ts', content.join('\n'))
}

// 获得当前项目配置的devops目录
function GetDevopsDomain() {
  let devops = JSON.parse(fs.readFileSync('devops.json'))
  let path = devops.path.substr(15)
  return path
}

// 直接运行命令
if (require.main == module) {
  if (process.argv.indexOf('stop') != -1) {
    StopDevServer()
  } else if (process.argv.indexOf('routers') != -1) {
    GenRouters('index', 'app', 'components')
  } else if (process.argv.indexOf('sites') != -1) {
    GenSites('sites')
  }
}

module.exports = {
  StopDevServer,
  SaveDevServer,
  GetDevopsDomain
}
