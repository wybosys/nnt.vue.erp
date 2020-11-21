import {IProperty, Property} from "../base/Property";
import {VariantType} from "../../core/Variant";
import {indexed, IndexedObject, toJson} from "../../core/Kernel";
import {AnyClass} from "../../core/Stl";
import {FieldOption, GetModel} from "../../core/Logic";
import {IntFloat} from "../../core/IntFloat";

const OPERATORS = ["gt", "gte", "eq", "not", "lt", "lte", "search"];

export interface IFilter extends IProperty {

  // 运算符
  operator: string;
}

export class Filters {

  // 从Model生成可筛选的条目
  static AddModel(filters: IFilter[], model: AnyClass) {
    let fps = GetModel(model)
    if (!fps)
      return;

    for (let k in fps) {
      let fp: FieldOption = fps[k];
      if (!fp.input)
        continue;

      let f: Filter;
      if (fp.integer) {
        f = Filter.Label(k, k, VariantType.INTEGER, 'eq');
      }

      if (fp.string) {
        f = Filter.Label(k, k, VariantType.STRING, 'eq');
      }

      filters.push(f);
    }
  }
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
      let cur: any = e.current;

      // intfloat需要传原始数据
      if (cur instanceof IntFloat)
        cur = cur.origin;

      q[e.variable] = indexed(e.operator, cur);
      and.push(q);
    });

    return toJson(r);
  }
}
