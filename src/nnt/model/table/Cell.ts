import {IProperty, Property} from "../base/Property";
import {VariantType} from "../../core/Variant";

export interface ICell extends IProperty {

}

export class Cell extends Property implements Cell {

  static Value(value: any, variable, type: VariantType): Cell {
    let r = new this();
    r.value = r.tmp = value;
    r.variable = variable;
    r.type = type;
    return r;
  }
}
