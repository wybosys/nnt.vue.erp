import {IProperty} from "../../../model/base/Property";
import {VariantType} from "../../../core/Variant";

export class InputType {
  input: boolean;
  label: boolean;
  datetime: boolean;
  switch: boolean;
  rocheck: boolean;
  rwcheck: boolean;

  static Detect(model: IProperty): InputType {
    let r = new InputType();
    if (model) {
      if (model.readonly || !model.editing) {
        if (model.type == VariantType.BOOLEAN)
          r.rocheck = true;
        else
          r.label = true;
      } else {
        if (model.type == VariantType.DATETIME) {
          r.datetime = true;
        } else if (model.type == VariantType.BOOLEAN) {
          r.rwcheck = true;
        } else {
          r.input = true;
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
    if (model.editing)
      return 'el-icon-edit';
    return null;
  }
}
