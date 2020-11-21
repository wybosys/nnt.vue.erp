import {IProperty, Property} from "../base/Property";
import {VariantType} from "../../core/Variant";
import {ArrayT} from "../../core/ArrayT";

export interface IParameter extends IProperty {

}

export class Parameter extends Property implements IParameter {

  static Regular(label: string, id: string, type: VariantType, def?: any): Parameter {
    let r = new this();
    r.label = label;
    r.variable = id;
    r.type = type;
    r.editing = true;
    r.value = def;
    r.strictAs(r, def);
    return r;
  }

  static Get(params: IParameter[], id: string, def = null): any {
    let fnd = ArrayT.QueryObject(params, e => {
      return e.variable == id;
    })
    if (fnd == null)
      return def;
    if (fnd.tmp == null || fnd.tmp === '')
      return def;
    return fnd.current;
  }
}
