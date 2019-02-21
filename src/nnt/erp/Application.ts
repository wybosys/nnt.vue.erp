import {Application as CoreApplication} from "../core/Application";
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {ModuleTree} from "./ModuleTree";

Vue.use(ElementUI);

export class Application extends CoreApplication {

  static shared: Application;

  private _tree: ModuleTree;
  get tree(): ModuleTree {
    if (!this._tree) {
      this._tree = new ModuleTree();
      this._tree.update(this.router);
    }
    return this._tree;
  }
}
