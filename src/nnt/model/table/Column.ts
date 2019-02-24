import {IProperty, Property} from "../base/Property";
import {VariantSortType, VariantType} from "../../core/Variant";

export interface IColumn extends IProperty {

  // 是否可以排序
  sort: VariantSortType;
}

export class Column extends Property implements IColumn {

  // 是否可以排序
  sort: VariantSortType = VariantSortType.NONE;

  static Header(label: string, variable: string, type: VariantType, sort = VariantSortType.NONE): Column {
    let r = new this();
    r.label = label;
    r.variable = variable;
    r.type = type;
    r.sort = sort;
    return r;
  }
}
