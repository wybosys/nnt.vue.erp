import {IApplicationRouter, IRoute} from "../core/Application";
import {ArrayT, StringT} from "../core/Kernel";

export class TreeNode {
  id: number;
  route: IRoute;
  children: TreeNode[] = [];
  cur: string;

  get label(): string {
    return this.route ? this.route.label : this.id.toString();
  }

  get path(): string {
    return this.route ? this.route.path : null;
  }

  // 查找指定路径上的节点，如果autocreate为true，则当找不到的时候会自动创建路径节点
  find(path: string, autocreate = false): TreeNode {
    let paths = StringT.Split(path, '/', true);

    let cur: TreeNode = this;
    for (let i = 0, l = paths.length; i < l; ++i) {
      let p = paths[i];
      let fnd = ArrayT.QueryObject(cur.children, e => {
        return e.cur == p;
      });
      if (fnd) {
        cur = fnd;
      } else if (autocreate) {
        fnd = new TreeNode();
        fnd.cur = p;
        cur.children.push(fnd);
        cur = fnd;
      } else {
        return null;
      }
    }
    return cur;
  }

  // 重新按照优先级排序，rec是否迭代
  sortChildren(rec: boolean) {
    this.children.sort((a, b) => {
      let ap = a.route ? a.route.priority : 9999;
      let bp = b.route ? b.route.priority : 9999;
      return ap - bp;
    });

    if (rec) {
      this.children.forEach(e => {
        e.sortChildren(rec);
      });
    }
  }
}

export class ModuleTree {

  update(router: IApplicationRouter) {
    // 清空原来的
    this.root.children.length = 0;

    // 添加新的
    let id = 0;
    router.routes.forEach(e => {
      if (!e.module)
        return;

      let fnd = this.root.find(e.path, true);
      fnd.route = e;
      fnd.id = ++id;
    });

    // 重新排序所有的
    this.root.sortChildren(true);
  }

  get children(): TreeNode[] {
    return this.root.children;
  }

  root = new TreeNode();
}
