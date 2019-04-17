import {IProperty} from "../../../model/base/Property";
import {VariantMajorType, VariantType} from "../../../core/Variant";

export class InputType {
  input: boolean;
  number: boolean;
  label: boolean;
  date: boolean;
  datetime: boolean;
  switch: boolean;
  rocheck: boolean;
  rwcheck: boolean;
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
          case VariantMajorType.DATE:
            r.date = true;
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
