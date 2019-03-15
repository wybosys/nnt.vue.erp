import {IProperty, Property} from "../base/Property";
import {VariantSortType, VariantType} from "../../core/Variant";

export interface IColumn extends IProperty {

  // 是否可以排序
  sort: VariantSortType;

  // 当前表格宽度扩展几倍
  widthfactor: number;
}

export class Column extends Property implements IColumn {

  // 是否可以排序
  sort: VariantSortType = VariantSortType.NONE;

  // 当前表格宽度扩展几倍
  widthfactor: number = 1;

  setWidthFactor(v: number): this {
    this.widthfactor = v;
    return this;
  }

  setSort(typ: VariantSortType): this {
    this.sort = typ;
    return this;
  }

  static Header(label: string, variable: string, type: VariantType, sort: VariantSortType = VariantSortType.NONE): Column {
    let r = new this();
    r.label = label;
    r.variable = variable;
    r.type = type;
    r.sort = sort;
    return r;
  }
}
