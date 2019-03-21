import {IProperty, Property} from "../base/Property";
import {ObjectT} from "../../core/Kernel";

export interface ICell extends IProperty {

}

export class Cell extends Property implements Cell {

  static Value(value: any): Cell {
    let r = new this();
    r.value = value;
    return r;
  }

  static KeyPath(value: any, kp: string): Cell {
    let r = new this();
    r.value = ObjectT.GetValueByKeyPath(value, kp);
    return r;
  }

  strictAs(r: IProperty): this {
    super.strictAs(r);
    this.variable = r.variable;
    return this;
  }
}
