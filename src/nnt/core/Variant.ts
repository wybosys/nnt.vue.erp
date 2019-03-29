import {
  asString,
  DateTime,
  MultiMap,
  StringT,
  toBoolean,
  toDouble,
  toInt,
  toJson,
  toJsonObject,
  toNumber
} from "./Kernel";

export enum VariantType {
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
  PERCENT = 14, // 百分数
}

export enum VariantSortType {
  NONE = 0,
  ASC = 1,
  DESC = 2,
  CUSTOM = 3
}

export function DefaultValue(typ: VariantType) {
  let r: any = null;
  switch (typ) {
    case VariantType.INTEGER:
    case VariantType.DOUBLE:
    case VariantType.NUMBER:
    case VariantType.PERCENT:
      r = 0;
      break;
    case VariantType.BOOLEAN:
      r = false;
      break;
    case VariantType.PASSWORD:
    case VariantType.STRING:
      r = '';
      break;
    case VariantType.JSON:
      r = '{}';
      break;
    case VariantType.OBJECT:
      r = null;
      break;
    case VariantType.ARRAY:
      r = [];
      break;
    case VariantType.MAP:
      r = new Map();
      break;
    case VariantType.MULTIMAP:
      r = new MultiMap();
      break;
    case VariantType.DATETIME:
    case VariantType.DATE:
      r = DateTime.Current();
      break;
  }
  return r;
}

export function StrictValue(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ) {
    case VariantType.INTEGER:
      r = toInt(val);
      break;
    case VariantType.DOUBLE:
      r = toDouble(val);
      break;
    case VariantType.NUMBER:
      r = toNumber(val);
      break;
    case VariantType.PERCENT:
      r = toNumber(val);
      break;
    case VariantType.BOOLEAN:
      r = toBoolean(val);
      break;
    case VariantType.PASSWORD:
    case VariantType.STRING:
      r = asString(val);
      break;
    case VariantType.JSON:
      r = toJson(toJsonObject(val));
      break;
    case VariantType.OBJECT:
      r = toJsonObject(val);
      break;
    case VariantType.ARRAY:
      r = StringT.Split(val, ',');
      break;
    case VariantType.MAP:
      r = new Map();
      let t = toJsonObject(val);
      if (t) {
        for (let k in t)
          r.set(k, t[k]);
      }
      break;
    case VariantType.MULTIMAP:
      r = new MultiMap();
      if (t) {
        for (let k in t)
          r.replace(k, t[k]);
      }
      break;
    case VariantType.DATETIME:
    case VariantType.DATE:
      r = new DateTime(toInt(val) * 1000);
      break;
  }
  return r;
}
