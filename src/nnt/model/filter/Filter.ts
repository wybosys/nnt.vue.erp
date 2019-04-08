import {IProperty, Property} from "../base/Property";
import {VariantType} from "../../core/Variant";
import {indexed, IndexedObject, toJson} from "../../core/Kernel";

const OPERATORS = ["gt", "gte", "eq", "not", "lt", "lte"];

export interface IFilter extends IProperty {

  // 运算符
  operator: string;
}

export class Filter extends Property implements IFilter {

  // 运算符
  operator: string;

  static Label(label: string, variable: string, type: VariantType, operator?: string, value?: any): Filter {
    let r = new this();
    r.value = r.tmp = value;
    r.variable = variable;
    r.label = label;
    r.type = type;
    r.editing = true;
    r.operator = operator;
    return r;
  }

  // 转换成请求数据时，服务端要求的类型
  static Translate(filters: IFilter[]): string {
    let r: IndexedObject = {};
    let and: IndexedObject[] = [];
    r.and = and;

    filters.forEach(e => {
      if (e.tmp == null || e.tmp === '')
        return;
      let q: IndexedObject = {};
      q[e.variable] = indexed(e.operator, e.current);
      and.push(q);
    });

    return toJson(r);
  }
}
