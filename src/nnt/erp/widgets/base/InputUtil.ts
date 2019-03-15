import {IProperty} from "../../../model/base/Property";
import {VariantType} from "../../../core/Variant";

export class InputType {
  input: boolean;
  number: boolean;
  label: boolean;
  date: boolean;
  datetime: boolean;
  switch: boolean;
  rocheck: boolean;
  rwcheck: boolean;

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
        switch (model.type) {
          case VariantType.DATETIME: {
            r.datetime = true;
          }
            break;
          case VariantType.DATE: {
            r.date = true;
          }
            break;
          case VariantType.BOOLEAN: {
            r.rwcheck = true;
          }
            break;
          case VariantType.INTEGER:
          case VariantType.DOUBLE: {
            r.number = true;
          }
            break;
          default: {
            r.input = true;
          }
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
