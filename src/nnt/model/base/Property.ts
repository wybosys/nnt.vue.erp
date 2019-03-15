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

  // 当前值
  current: any;

  // 正在修改的临时属性值(注意：通常为UI组件默认得类型，可以通过current来获得和value一样类型的临时属性值)
  tmp: any;

  // 引用的对象
  ref: any;

  // 是否只读
  readonly: boolean;

  // 是否正在修改
  editing: boolean;

  // 是否被修改
  isModified(): boolean;
}

export class Property implements IProperty /*IPropertyEditable*/ {

  static _IMP_VariantToUIValue: (val: any, typ: VariantType) => any;
  static _IMP_UIValToVariant: (val: any, typ: VariantType) => any;

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

  // 正在修改的临时属性值(注意：通常为UI组件默认得类型，可以通过current来获得和value一样类型的临时属性值)
  tmp: any = null;

  // 当前值
  get current(): any {
    return Property._IMP_UIValToVariant(this.tmp, this.type);
  }

  // 引用的对象
  ref: any = null;

  // 是否只读
  readonly: boolean = false;

  // 是否正在修改
  editing: boolean = false;

  isModified(): boolean {
    return this.current != this.value;
  }

  static Simple(index: number, label: string, value: any, type: VariantType): Property {
    let r = new this();
    r.index = index;
    r.value = r.tmp = value;
    r.label = label;
    r.type = type;
    return r;
  }

  static Extract(obj: any, label: string, variname: string, type: VariantType): Property {
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
    this.tmp = Property._IMP_VariantToUIValue(this.value, this.type);
    return this;
  }
}
