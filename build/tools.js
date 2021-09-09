"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDevopsDomain = exports.GenSites = exports.GenRouters = exports.RouterNode = exports.UppercaseFirst = exports.SaveDevServer = exports.StopDevServer = exports.CONFIG = void 0;
const fs = require("fs");
const path = require("path");
exports.CONFIG = {
    CONFIG_DEV: {
        host: 'localhost',
        port: 8080,
    },
    verbose: true,
    sourcemap: true
};
if ('HOST' in process.env)
    exports.CONFIG.CONFIG_DEV.host = process.env.HOST ?? "localhost";
if ('PORT' in process.env)
    exports.CONFIG.CONFIG_DEV.port = parseInt(process.env.PORT ?? "8080");
if ('VERBOSE' in process.env)
    exports.CONFIG.verbose = process.env.VERBOSE !== 'false';
if ('SOURCEMAP' in process.env)
    exports.CONFIG.sourcemap = process.env.SOURCEMAP !== 'false';
function StopDevServer() {
    if (fs.existsSync('run/dev-server.pid')) {
        let buf = fs.readFileSync('run/dev-server.pid');
        let pid = buf.toString();
        try {
            process.kill(parseInt(pid));
        }
        catch (err) {
        }
        fs.unlinkSync('run/dev-server.pid');
    }
}
exports.StopDevServer = StopDevServer;
function SaveDevServer() {
    if (!fs.existsSync('run'))
        fs.mkdirSync('run');
    fs.writeFileSync('run/dev-server.pid', process.pid.toString());
}
exports.SaveDevServer = SaveDevServer;
function UppercaseFirst(str) {
    if (!str || str.length === 0)
        return str;
    return str[0].toUpperCase() + str.substr(1);
}
exports.UppercaseFirst = UppercaseFirst;
class RouterNode {
    path;
    rpath;
    node;
    module = false;
    priority = 9999;
    label;
    page;
    hide = false;
    parent;
    default = false;
    children = [];
    dir = '';
    clone() {
        let r = new RouterNode();
        r.path = this.path;
        r.rpath = this.rpath;
        r.node = this.node;
        r.module = this.module;
        r.priority = this.priority;
        r.label = this.label;
        r.page = this.page;
        r.hide = this.hide;
        r.dir = this.dir;
        return r;
    }
    hash() {
        let pnodes = [this.node];
        let p = this.parent;
        while (p) {
            pnodes.push(p.node);
            p = p.parent;
        }
        pnodes.reverse();
        return '_' + pnodes.join('_');
    }
    name() {
        let pnodes = [this.node];
        let p = this.parent;
        while (p) {
            pnodes.push(p.node);
            p = p.parent;
        }
        pnodes.reverse();
        return pnodes.join('.');
    }
    add(node) {
        node.parent = this;
        this.children.push(node);
    }
    all() {
        let r = [this];
        this.children.forEach(e => {
            r = r.concat(e.all());
        });
        r.sort((l, r) => {
            return l.node.localeCompare(r.node);
        });
        return r;
    }
    static FromDirectory(dir, relv) {
        let r = new RouterNode();
        r.node = path.basename(dir);
        r.dir = dir;
        r.path = relv === '' ? '/' : relv;
        r.rpath = r.node;
        r.label = UppercaseFirst(r.node);
        r.module = true;
        if (fs.existsSync(`src/${dir}/${r.label}.vue`)) {
            r.page = r.label;
        }
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
        fs.readdirSync(`src/${dir}`).forEach(e => {
            let st = fs.statSync(`src/${dir}/${e}`);
            if (st.isDirectory()) {
                let c = RouterNode.FromDirectory(`${dir}/${e}`, `${relv}/${e}`);
                if (!c)
                    return;
                r.add(c);
            }
            else if (e.endsWith('.vue')) {
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
exports.RouterNode = RouterNode;
function GenRouters(outputfile, ...srcdirs) {
    let imports = [];
    let defs = [];
    let decls = [];
    srcdirs.forEach(e => {
        if (!fs.existsSync(`src/${e}`))
            return;
        let n = RouterNode.FromDirectory(`${e}`, '');
        n.all().forEach(e => {
            if (!e.page)
                return;
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
exports.GenRouters = GenRouters;
function GenSites(dir) {
    let sites = [];
    let defaultsite = null;
    fs.readdirSync(`src/${dir}`).forEach(e => {
        let st = fs.statSync(`src/${dir}/${e}`);
        if (!st.isDirectory())
            return;
        sites.push(e);
        GenRouters(`${e}`, `sites/${e}`);
        let cfg = 'src/' + dir + '/' + e + '/config.json';
        if (fs.existsSync(cfg)) {
            let cfgobj = JSON.parse(fs.readFileSync(cfg).toLocaleString());
            if (cfgobj.default)
                defaultsite = e;
        }
    });
    let index = [];
    index.push('// generated by build/tools.js');
    index.push('const _ = () => import("../nnt/sites/Index.vue")');
    sites.forEach(site => {
        index.push('const ' + site + ' = () => import("./' + site + '")');
    });
    index.push('');
    index.push('export default {');
    index.push('  routes: [');
    index.push("    {\n      path: '/',\n      component: _,\n      name: '_site_'\n    },");
    index.push("    {\n      path: '/:site',\n      component: _,\n      name: '_site__'\n    },");
    index.push("    {\n      path: '*',\n      component: _,\n      name: '_any_'\n    }");
    index.push('  ],');
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
exports.GenSites = GenSites;
function GetDevopsDomain() {
    let devops = JSON.parse(fs.readFileSync('devops.json').toLocaleString());
    if (devops.standalone)
        return '';
    return devops.path.substr(15);
}
exports.GetDevopsDomain = GetDevopsDomain;
if (require.main === module) {
    if (process.argv.indexOf('stop') !== -1) {
        StopDevServer();
    }
    else if (process.argv.indexOf('routers') !== -1) {
        GenRouters('index', 'app', 'components');
    }
    else if (process.argv.indexOf('sites') !== -1) {
        GenSites('sites');
    }
}
