import {IProperty, Property} from "../base/Property";
import {VariantSortType, VariantType} from "../../core/Variant";
import {AnyClass} from "../../core/Stl";
import {FieldOption, GetModel} from "../../core/Logic";

export interface IColumn extends IProperty {

  // 是否可以排序
  sort: VariantSortType;

  // 当前表格宽度扩展几倍
  widthfactor: number;

  // 一些情况下，设置的数据需要被转换才能显示到cell中，所以可以通过设置转换函数可以当strictAs的时候，自动转换数据
  convert: (e: any, anydata?: any) => any;
}

export class Columns {

  static AddModel(columns: IColumn[], model: AnyClass) {
    let fps = GetModel(model)
    if (!fps)
      return;

    for (let k in fps) {
      let fp: FieldOption = fps[k];
      if (!fp.output)
        continue;

      let col: Column;

      if (fp.integer) {
        col = Column.Header(k, k, VariantType.INTEGER);
      } else if (fp.string) {
        col = Column.Header(k, k, VariantType.STRING);
      }

      if (!fp.input)
        col.setReadonly(true);

      columns.push(col);
    }
  }
}

export class Column extends Property implements IColumn {

  // 是否可以排序
  sort: VariantSortType = VariantSortType.NONE;

  // 当前表格宽度扩展几倍
  widthfactor: number = 1;

  // 一些情况下，设置的数据需要被转换才能显示到cell中，所以可以通过设置转换函数可以当strictAs的时候，自动转换数据
  convert: (e: any, anydata?: any) => any;

  setWidthFactor(v: number): this {
    this.widthfactor = v;
    return this;
  }

  setSort(typ: VariantSortType): this {
    this.sort = typ;
    return this;
  }

  setConvert(convert: (e: any, anydata: any) => any): this {
    this.convert = convert;
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
