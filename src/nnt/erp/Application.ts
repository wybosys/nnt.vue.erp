import {Application as CoreApplication} from "../core/Application";
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {ModuleTree} from "./ModuleTree";
import Widgets from "./widgets/Widgets";
import {Property} from "../model/base/Property";
import {UIValToVariant, VariantToUIValue} from "./Variant";

Vue.use(ElementUI);
Vue.use(Widgets);

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

Property._IMP_UIValToVariant = UIValToVariant;
Property._IMP_VariantToUIValue = VariantToUIValue;
