import {VariantMajorType, VariantType} from "../core/Variant";
import {DateTime, EnumT, formatString, StringT, toDouble, toInt, toNumber} from "../core/Kernel";

export function VariantToUIValue(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.DATETIME:
      r = val ? new DateTime(val).toString('yyyy-MM-dd HH:mm:ss') : '';
      break;
    case VariantMajorType.DATE:
      r = new DateTime(val).toString('yyyy-MM-dd');
      break;
    case VariantMajorType.PERCENTAGE:
      r = StringT.TermFloat(formatString("%.2f", val * 100));
      break;
    case VariantMajorType.ENUM:
      r = (<EnumT>typ.value).defineOf(val);
      break;
    case VariantMajorType.BOOLEAN:
      r = !!val;
      break;
    default:
      r = val;
      break;
  }
  return r;
}

export function UIValToVariant(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.DATETIME:
    case VariantMajorType.DATE:
      r = val == '' ? null : DateTime.parse(val).timestamp;
      break;
    case VariantMajorType.INTEGER:
      r = toInt(val);
      break;
    case VariantMajorType.NUMBER:
      r = toNumber(val);
      break;
    case VariantMajorType.DOUBLE:
      r = toDouble(val);
      break;
    case VariantMajorType.PERCENTAGE:
      r = toDouble(val) / 100;
      break;
    case VariantMajorType.ENUM:
      r = (<EnumT>typ.value).valueOf(val);
      break;
    case VariantMajorType.BOOLEAN:
      r = !!val;
      break;
    default:
      r = val;
      break;
  }
  return r;
}
