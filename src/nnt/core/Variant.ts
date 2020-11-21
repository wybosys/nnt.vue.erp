import {asString, toBoolean, toDouble, toInt, toJson, toJsonObject, toNumber} from "./Kernel";
import {EnumT} from "./EnumT";
import {MultiMap} from "./MultiMap";
import {DateTime} from "./DateTime";
import {IntFloat} from "./IntFloat";
import {StringT} from "./StringT";

// 系统中支持的变量数据主类型
export enum VariantMajorType {
  ANY = 0,
  INTEGER = 1,
  DOUBLE = 2,
  BOOLEAN = 3,
  NUMBER = 4,
  STRING = 5,
  JSON = 6,
  OBJECT = 7,
  ARRAY = 8,
  MAP = 9,
  MULTIMAP = 10,
  PASSWORD = 11,
  DATETIME = 12, // 日期时间
  DATE = 13, // 日期
  PERCENTAGE = 14, // 百分数
  ENUM = 15, // 枚举
  INTFLOAT = 16, // 使用int表示float,
  DATETIME_RANGE = 17, // 日期时间区间
  DATE_RANGE = 18, // 日期区间
}

// 有些变量类型需要附加传递数据，所以数据类型定义为一个结构，而不是传统的标量类型
export class VariantType {

  constructor(major: VariantMajorType) {
    this.major = major;
  }

  // 主类型
  major: VariantMajorType;

  // 绑定的数据
  value: any;

  // 预定的数据类型
  static ANY = new VariantType(VariantMajorType.ANY);
  static INTEGER = new VariantType(VariantMajorType.INTEGER);
  static DOUBLE = new VariantType(VariantMajorType.DOUBLE);
  static BOOLEAN = new VariantType(VariantMajorType.BOOLEAN);
  static NUMBER = new VariantType(VariantMajorType.NUMBER);
  static STRING = new VariantType(VariantMajorType.STRING);
  static JSON = new VariantType(VariantMajorType.JSON);
  static OBJECT = new VariantType(VariantMajorType.OBJECT);
  static ARRAY = new VariantType(VariantMajorType.ARRAY);
  static MAP = new VariantType(VariantMajorType.MAP);
  static MULTIMAP = new VariantType(VariantMajorType.MULTIMAP);
  static PASSWORD = new VariantType(VariantMajorType.PASSWORD);
  static DATETIME = new VariantType(VariantMajorType.DATETIME);
  static DATE = new VariantType(VariantMajorType.DATE);
  static PERCENTAGE = new VariantType(VariantMajorType.PERCENTAGE);
  static DATETIME_RANGE = new VariantType(VariantMajorType.DATETIME_RANGE);
  static DATE_RANGE = new VariantType(VariantMajorType.DATE_RANGE);

  // 枚举类型
  static ENUM(typ: any): VariantType {
    let r = new VariantType(VariantMajorType.ENUM);
    r.value = new EnumT(typ);
    return r;
  }

  // 当时intfloat类型时代表的缩放系数
  scale: number;

  // 用来保证intfloat传入的scale返回的都是同一个类型
  private static __intfloats = {};

  // INTFLOAT类型
  static INTFLOAT(s: number): VariantType {
    let fnd: VariantType = this.__intfloats[s];
    if (!fnd) {
      fnd = new VariantType(VariantMajorType.INTFLOAT);
      fnd.scale = s;
      this.__intfloats[s] = fnd;
    }
    return fnd;
  }

  static INTFLOAT_MONEY = VariantType.INTFLOAT(100);
  static INTFLOAT_PERCENTAGE = VariantType.INTFLOAT(10000);
}

// 变量排序方式
export enum VariantSortType {
  NONE = 0,
  ASC = 1,
  DESC = 2,
  CUSTOM = 3
}

// 变量对应的默认数据
export function DefaultValue(typ: VariantType) {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.INTEGER:
    case VariantMajorType.DOUBLE:
    case VariantMajorType.NUMBER:
    case VariantMajorType.PERCENTAGE:
    case VariantMajorType.INTFLOAT:
      r = 0;
      break;
    case VariantMajorType.BOOLEAN:
      r = false;
      break;
    case VariantMajorType.PASSWORD:
    case VariantMajorType.STRING:
      r = '';
      break;
    case VariantMajorType.JSON:
      r = '{}';
      break;
    case VariantMajorType.OBJECT:
      r = null;
      break;
    case VariantMajorType.ARRAY:
      r = [];
      break;
    case VariantMajorType.MAP:
      r = new Map();
      break;
    case VariantMajorType.MULTIMAP:
      r = new MultiMap();
      break;
    case VariantMajorType.DATETIME:
    case VariantMajorType.DATE:
      r = DateTime.Current();
      break;
    case VariantMajorType.ENUM:
      r = (<EnumT>typ.value).defines[0];
      break;
  }
  return r;
}

// 转换传入的数据到指定的变量类型
export function StrictValue(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.INTEGER: {
      r = toInt(val);
    }
      break;
    case VariantMajorType.DOUBLE: {
      r = toDouble(val);
    }
      break;
    case VariantMajorType.NUMBER: {
      r = toNumber(val);
    }
      break;
    case VariantMajorType.INTFLOAT: {
      r = IntFloat.From(val, typ.scale);
    }
      break;
    case VariantMajorType.PERCENTAGE: {
      r = toNumber(val);
    }
      break;
    case VariantMajorType.BOOLEAN: {
      r = toBoolean(val);
    }
      break;
    case VariantMajorType.PASSWORD:
    case VariantMajorType.STRING: {
      r = asString(val);
    }
      break;
    case VariantMajorType.JSON: {
      r = toJson(toJsonObject(val));
    }
      break;
    case VariantMajorType.OBJECT: {
      r = toJsonObject(val);
    }
      break;
    case VariantMajorType.ARRAY: {
      r = StringT.Split(val, ',');
    }
      break;
    case VariantMajorType.MAP: {
      r = new Map();
      let t = toJsonObject(val);
      if (t) {
        for (let k in t)
          r.set(k, t[k]);
      }
    }
      break;
    case VariantMajorType.MULTIMAP: {
      r = new MultiMap();
      let t = toJsonObject(val);
      if (t) {
        for (let k in t)
          r.replace(k, t[k]);
      }
    }
      break;
    case VariantMajorType.DATETIME:
    case VariantMajorType.DATE: {
      r = new DateTime(toInt(val) * 1000);
    }
      break;
    default: {
      r = val;
    }
      break;
  }
  return r;
}
