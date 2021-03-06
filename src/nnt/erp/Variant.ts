import {VariantMajorType, VariantType} from "../core/Variant";
import {toBoolean, toDouble, toInt, toNumber} from "../core/Kernel";
import {DateTime, DateTimeRange} from "../core/DateTime";
import {formatString, StringT} from "../core/StringT";
import {EnumT} from "../core/EnumT";
import {IntFloat} from "../core/IntFloat";

export function VariantToUIValue(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.DATETIME: {
      r = val ? new DateTime(val).toString('yyyy-MM-dd HH:mm:ss') : '';
    }
      break;
    case VariantMajorType.DATETIME_RANGE: {
      if (val) {
        let f = (<DateTimeRange>val).from.toString('yyyy-MM-dd HH:mm:ss');
        let t = (<DateTimeRange>val).to.toString('yyyy-MM-dd HH:mm:ss');
        r = [f, t];
      }
    }
      break;
    case VariantMajorType.DATE: {
      r = new DateTime(val).toString('yyyy-MM-dd');
    }
      break;
    case VariantMajorType.DATE_RANGE: {
      if (val) {
        let f = (<DateTimeRange>val).from.toString('yyyy-MM-dd');
        let t = (<DateTimeRange>val).to.toString('yyyy-MM-dd');
        r = [f, t];
      }
    }
      break;
    case VariantMajorType.PERCENTAGE: {
      r = StringT.TermFloat(formatString("%.2f", val * 100));
    }
      break;
    case VariantMajorType.ENUM: {
      r = (<EnumT>typ.value).defineOf(val);
    }
      break;
    case VariantMajorType.BOOLEAN: {
      r = !!val
    }
      break;
    case VariantMajorType.INTFLOAT: {
      r = (<IntFloat>val).value;
    }
      break;
    default: {
      r = val;
    }
      break;
  }
  return r;
}

export function UIValToVariant(val: any, typ: VariantType): any {
  let r: any = null;
  switch (typ.major) {
    case VariantMajorType.DATETIME: {
      r = val == '' ? null : DateTime.parse(val).timestamp;
    }
      break;
    case VariantMajorType.DATETIME_RANGE: {
      if (val) {
        r = new DateTimeRange();
        r.from = DateTime.parse(val[0]);
        r.to = DateTime.parse(val[1]);
      }
    }
      break;
    case VariantMajorType.DATE: {
      r = val == '' ? null : DateTime.parse(val + ' 00:00:00').timestamp;
    }
      break;
    case VariantMajorType.DATE_RANGE: {
      if (val) {
        r = new DateTimeRange();
        r.from = DateTime.parse(val[0] + ' 00:00:00');
        r.to = DateTime.parse(val[1] + ' 00:00:00');
      }
    }
      break;
    case VariantMajorType.INTEGER: {
      r = toInt(val);
    }
      break;
    case VariantMajorType.NUMBER: {
      r = toNumber(val);
    }
      break;
    case VariantMajorType.DOUBLE: {
      r = toDouble(val);
    }
      break;
    case VariantMajorType.PERCENTAGE: {
      r = toDouble(val) / 100;
    }
      break;
    case VariantMajorType.ENUM: {
      r = (<EnumT>typ.value).valueOf(val);
    }
      break;
    case VariantMajorType.BOOLEAN: {
      r = toBoolean(val) ? 1 : 0
    }
      break;
    case VariantMajorType.INTFLOAT: {
      r = IntFloat.FromValue(toNumber(val), typ.scale);
    }
      break;
    default: {
      r = val;
    }
      break;
  }
  return r;
}
