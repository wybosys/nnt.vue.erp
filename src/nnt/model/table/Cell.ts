import {IProperty, Property} from "../base/Property";
import {ObjectT} from "../../core/Kernel";
import {IColumn} from "./Column";

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

  strictAs(r: IProperty, anydata?: any): this {
    // 当严格化成col的定义是，需要处理存在数据预转换的情况
    if (typeof (<IColumn>r).convert == "function") {
      this.value = (<IColumn>r).convert(this.value, anydata);
    }

    // 标准流程
    super.strictAs(r, anydata);
    this.variable = r.variable;
    return this;
  }
}
