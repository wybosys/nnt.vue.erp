import {IProperty, Property} from "../base/Property";

export interface ICell extends IProperty {

}

export class Cell extends Property implements Cell {

  static Value(value: any): Cell {
    let r = new this();
    r.value = value;
    return r;
  }

  strictAs(r: IProperty): this {
    super.strictAs(r);
    this.variable = r.variable;
    return this;
  }
}
