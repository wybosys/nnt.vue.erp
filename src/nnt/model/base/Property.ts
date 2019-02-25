import {VariantType} from "../../core/Variant";

export interface IProperty {

  // 索引
  index: number;

  // 属性variable名称
  variable: string;

  // 属性描述名称
  label: string;

  // 属性说明
  desc: string;

  // 属性类型
  type: VariantType;

  // 属性值
  value: any;

  // 正在修改的临时属性值
  tmp: any;

  // 引用的对象
  ref: any;

  // 是否只读
  readonly: boolean;

  // 是否正在修改
  editing: boolean;
}

export class Property implements IProperty {

  // 索引
  index: number = 0;

  // 属性variable名称
  variable: string = '';

  // 属性描述名称
  label: string = '';

  // 属性说明
  desc: string = '';

  // 属性类型
  type: VariantType = VariantType.ANY;

  // 属性值
  value: any = null;

  // 正在修改的临时属性值
  tmp: any = null;

  // 引用的对象
  ref: any = null;

  // 是否只读
  readonly: boolean = false;

  // 是否正在修改
  editing: boolean = false;

  static Simple(index: number, label: string, value: any, type: VariantType): IProperty {
    let r = new this();
    r.index = index;
    r.value = r.tmp = value;
    r.label = label;
    r.type = type;
    return r;
  }

  static Extract(obj: any, label: string, variname: string, type: VariantType): IProperty {
    let r = new this();
    r.value = r.tmp = obj[variname];
    r.variable = variname;
    r.label = label;
    r.type = type;
    return r;
  }

  setReadonly(b = true): this {
    this.readonly = b;
    return this;
  }

  strictAs(r: IProperty): this {
    this.readonly = r.readonly;
    this.type = r.type;
    return this;
  }
}
