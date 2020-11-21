import {ArrayT} from "./ArrayT";

// 操作枚举类型
export class EnumT {

  constructor(e: any) {
    this._enum = e;
    this._defines = EnumT.Defines(e);
  }

  // 如果使用的是对象模式，则直接保存的是所有的定义
  private _defines: string[];

  get defines(): string[] {
    return this._defines;
  }

  valueOf(def: string): any {
    return EnumT.DefineToValue(this._enum, def);
  }

  defineOf(val: any): string {
    return EnumT.ValueToDefine(this._enum, val);
  }

  // 枚举对象
  private _enum: any;

  static DefineToValue<T>(obj: T, str: string): T {
    return obj[str];
  }

  static ValueToDefine<T>(obj: T, val: T): string {
    return (<any>obj)[val];
  }

  static Defines<T>(obj: T): string[] {
    let keys = Object.keys(obj);
    // ts生成enum，key从后半部分开始
    return ArrayT.RangeOf(keys, keys.length / 2);
  }

  static DefineAt<T>(obj: T, idx: number): string {
    let defs = this.Defines(obj);
    return defs[idx];
  }
}
