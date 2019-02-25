import {MultiMap} from "./Kernel";

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
  DATETIME = 12,
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
      r = new Date().getTime();
      break;
  }
  return r;
}
