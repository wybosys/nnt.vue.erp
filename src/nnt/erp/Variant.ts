import {VariantType} from "../core/Variant";
import {DateTime, toFloat, toInt, toNumber} from "../core/Kernel";

export function VariantToUIValue(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ) {
    case VariantType.DATETIME:
      r = new DateTime(val).toString('yyyy-MM-dd HH:mm:ss');
      break;
    case VariantType.DATE:
      r = new DateTime(val).toString('yyyy-MM-dd');
      break;
    default:
      r = val;
      break;
  }
  return r;
}

export function UIValToVariant(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ) {
    case VariantType.DATETIME:
    case VariantType.DATE:
      r = DateTime.parse(val).timestamp;
      break;
    case VariantType.INTEGER:
      r = toInt(val);
      break;
    case VariantType.NUMBER:
      r = toNumber(val);
      break;
    case VariantType.DOUBLE:
      r = toFloat(val);
      break;
    default:
      r = val;
      break;
  }
  return r;
}
