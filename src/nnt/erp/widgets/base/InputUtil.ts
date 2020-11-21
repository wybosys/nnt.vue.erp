import {IProperty} from "../../../model/base/Property";
import {VariantMajorType, VariantType} from "../../../core/Variant";

export class InputType {

  // 文字输入
  input: boolean;

  // 数字输入
  number: boolean;

  // 只读文字
  label: boolean;

  // 日期输入
  date: boolean;
  date_range: boolean;

  // 日期时间输入
  datetime: boolean;
  datetime_range: boolean;

  // bool开关
  rocheck: boolean;
  rwcheck: boolean;

  // 列表
  combo: boolean;

  static Detect(model: IProperty): InputType {
    let r = new InputType();
    if (model) {
      if (model.readonly || !model.editing) {
        if (model.type == VariantType.BOOLEAN) {
          r.rocheck = true;
        } else {
          r.label = true;
        }
      } else {
        switch (model.type.major) {
          case VariantMajorType.DATETIME:
            r.datetime = true;
            break;
          case VariantMajorType.DATETIME_RANGE:
            r.datetime_range = true;
            break;
          case VariantMajorType.DATE:
            r.date = true;
            break;
          case VariantMajorType.DATE_RANGE:
            r.date_range = true;
            break;
          case VariantMajorType.BOOLEAN:
            r.rwcheck = true;
            break;
          case VariantMajorType.INTEGER:
          case VariantMajorType.DOUBLE:
          case VariantMajorType.INTFLOAT:
            r.number = true;
            break;
          case VariantMajorType.ENUM:
            r.combo = true;
            break;
          default:
            r.input = true;
            break;
        }
      }
    }
    return r;
  }
}

export class InputUtil {

  static PropertyIsReadonly(model: IProperty): boolean {
    if (!model)
      return true;
    if (model.readonly)
      return true;
    if (!model.editing)
      return true;
    return false;
  }

  static PropertySuffixIcon(model: IProperty): string {
    if (model.readonly)
      return null;
    /*
    if (model.editing)
      return 'el-icon-edit';
      */
    return null;
  }
}
