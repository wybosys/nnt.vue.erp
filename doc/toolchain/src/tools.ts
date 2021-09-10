import fs = require('fs');
import path = require('path');

// 处理开发配置
export let CONFIG = {
  CONFIG_DEV: {
    host: 'localhost',
    port: 8080,
  },
  verbose: true,
  sourcemap: true
}

if ('HOST' in process.env)
  CONFIG.CONFIG_DEV.host = process.env.HOST ?? "localhost"

if ('PORT' in process.env)
  CONFIG.CONFIG_DEV.port = parseInt(process.env.PORT ?? "8080")

if ('VERBOSE' in process.env)
  CONFIG.verbose = process.env.VERBOSE !== 'false'

if ('SOURCEMAP' in process.env)
  CONFIG.sourcemap = process.env.SOURCEMAP !== 'false'

// 停止dev用的web服务器
export function StopDevServer() {
  if (fs.existsSync('run/dev-server.pid')) {
    let buf = fs.readFileSync('run/dev-server.pid');
    let pid = buf.toString();
    try {
      process.kill(parseInt(pid));
    } catch (err) {
    }
    fs.unlinkSync('run/dev-server.pid');
  }
}

// 保存dev运行的服务器信息
export function SaveDevServer() {
  if (!fs.existsSync('run'))
    fs.mkdirSync('run');
  fs.writeFileSync('run/dev-server.pid', process.pid.toString());
}

export function UppercaseFirst(str: string) {
  if (!str || str.length === 0)
    return str;
  return str[0].toUpperCase() + str.substr(1);
}

// 保存当前项目解析出的router架构
export class RouterNode {

  // 访问路径
  path?: string

  // 相对访问路径
  rpath?: string

  // 节点名
  node?: string

  // 是否为模块
  module = false

  // 优先级
  priority = 9999

  // 显示的名称
  label?: string

  // 页面路径
  page?: string

  // 是否隐藏
  hide = false

  // 父节点
  parent?: RouterNode

  // 是否为默认节点
  default = false

  // 子节点
  children: RouterNode[] = []

  // 模块所在目录
  dir = ''

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

  add(node: RouterNode) {
    node.parent = this
    this.children.push(node)
  }

  all() {
    let r: RouterNode[] = [this];
    this.children.forEach(e => {
      r = r.concat(e.all())
    });
    r.sort((l, r) => {
      return l.node!.localeCompare(r.node!)
    })
    return r
  }

  // 解析目录
  static FromDirectory(dir: string, relv: string) {
    let r = new RouterNode();

    r.node = path.basename(dir);
    r.dir = dir;
    r.path = relv === '' ? '/' : relv;
    r.rpath = r.node;
    r.label = UppercaseFirst(r.node);
    r.module = true;

    // 判断是否存在实现的页面
    if (fs.existsSync(`src/${dir}/${r.label}.vue`)) {
      r.page = r.label;
    }

    // 解析配置
    if (fs.existsSync(`src/${dir}/config.json`)) {
      let cfgobj = JSON.parse(fs.readFileSync(`src/${dir}/config.json`).toLocaleString());
      if (cfgobj.path)
        r.path = cfgobj.path;
      if (cfgobj.rpath)
        r.rpath = cfgobj.rpath;
      if (cfgobj.default)
        r.default = true;
      if (cfgobj.label)
        r.label = cfgobj.label;
      if (cfgobj.priority >= 0)
        r.priority = cfgobj.priority;
      if (cfgobj.hide)
        r.hide = true;
    }

    // 解析子节点
    fs.readdirSync(`src/${dir}`).forEach(e => {
      let st = fs.statSync(`src/${dir}/${e}`);
      if (st.isDirectory()) {
        let c = RouterNode.FromDirectory(`${dir}/${e}`, `${relv}/${e}`);
        if (!c)
          return;

        // 原始子节点
        r.add(c);
      } else if (e.endsWith('.vue')) {
        let c = new RouterNode();
        c.dir = dir;
        c.page = c.label = path.basename(e, '.vue');
        c.node = c.page.toLowerCase();
        c.rpath = c.node;
        c.path = `${relv}/${c.rpath}`;
        r.add(c);
      }
    });

    r.module = r.children.length !== 0;
    return r;
  }
}

export function GenRouters(outputfile: string, ...srcdirs: string[]) {
  let imports: string[] = [];
  let defs: string[] = [];
  let decls: string[] = [];

  srcdirs.forEach(e => {
    if (!fs.existsSync(`src/${e}`))
      return;
    let n = RouterNode.FromDirectory(`${e}`, '');
    n.all().forEach(e => {
      if (!e.page)
        return;

      // 输出vue需要的router.ts路由描述文件
      {
        let key = e.hash();
        imports.push(`const ${key} = () => import("../${e.dir}/${e.page}.vue")`);

        let def = "    {";
        let arr = [
          `\n      path: '${e.path}'`,
          `\n      component: ${key}`,
          `\n      name: '${e.name()}'`,
          `\n      label: '${e.label}'`
        ];

        if (e.module) {
          arr.push(`\n      module: true`);
          arr.push(`\n      priority: ${e.priority}`);
          if (e.hide)
            arr.push(`\n      hide: true`);
        }

        def += arr.join(',') + "\n    }";
        defs.push(def);
      }

      // 数据跨项目使用的路有描述文件
      {
        let decl = "    {";
        let arr = [
          `\n      "path": "${e.path}"`,
          `\n      "name": "${e.name()}"`,
          `\n      "label": "${e.label}"`
        ];

        if (e.module) {
          arr.push(`\n      "module": true`);
          arr.push(`\n      "priority": ${e.priority}`);
          if (e.hide)
            arr.push(`\n      "hide": true`);
        }

        decl += arr.join(',') + "\n    }";
        decls.push(decl);
      }
    });
  });

  let index = [];
  index.push('// generated by build/tools.js');
  index.push(imports.join('\n'));
  index.push('\n');
  index.push('export default {');
  index.push('  routes: [');
  index.push(defs.join(',\n'));
  index.push(']');
  index.push('}');
  fs.writeFileSync(`src/router/${outputfile}.ts`, index.join('\n'));

  let json = [];
  json.push('[');
  json.push(decls.join(',\n'));
  json.push(']');
  fs.writeFileSync(`src/router/${outputfile}.json`, json.join('\n'));
}

export function GenSites(dir: string) {
  let sites: string[] = [];
  let defaultsite = null;

  fs.readdirSync(`src/${dir}`).forEach(e => {
    let st = fs.statSync(`src/${dir}/${e}`);
    if (!st.isDirectory())
      return;
    sites.push(e);

    GenRouters(`${e}`, `sites/${e}`);

    // 读取配置
    let cfg = 'src/' + dir + '/' + e + '/config.json';
    if (fs.existsSync(cfg)) {
      let cfgobj = JSON.parse(fs.readFileSync(cfg).toLocaleString());
      if (cfgobj.default)
        defaultsite = e;
    }
  });

  // 生成基础的routers，来支持多站点
  let index = [];
  index.push('// generated by build/tools.js');

  // 导入对象
  index.push('const _ = () => import("../nnt/sites/Index.vue")');
  sites.forEach(site => {
    index.push('const ' + site + ' = () => import("./' + site + '")');
  });

  // 生成路由配置
  index.push('');
  index.push('export default {');

  // 生成gateway路由配置
  index.push('  routes: [');
  index.push("    {\n      path: '/',\n      component: _,\n      name: '_site_'\n    },");
  index.push("    {\n      path: '/:site',\n      component: _,\n      name: '_site__'\n    },");
  index.push("    {\n      path: '*',\n      component: _,\n      name: '_any_'\n    }")
  index.push('  ],');

  // 生成sites的配置
  index.push('  sites: {');
  let sitecontents = [];
  sites.forEach(each => {
    sitecontents.push('    ' + each + ': ' + each);
  });
  if (defaultsite && !('default' in sites))
    sitecontents.push('    default: ' + defaultsite);
  index.push(sitecontents.join(',\n'));
  index.push('  }');

  index.push('}');
  fs.writeFileSync('src/router/index.ts', index.join('\n'));
}

// 获得当前项目配置的devops目录
export function GetDevopsDomain() {
  let devops = JSON.parse(fs.readFileSync('devops.json').toLocaleString());
  if (devops.standalone)
    return '';
  return devops.path.substr(15);
}

// 直接运行命令
if (require.main === module) {
  if (process.argv.indexOf('stop') !== -1) {
    StopDevServer();
  } else if (process.argv.indexOf('routers') !== -1) {
    GenRouters('index', 'app', 'components');
  } else if (process.argv.indexOf('sites') !== -1) {
    GenSites('sites');
  }
}
