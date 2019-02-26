import {IProperty} from "../../../model/base/Property";
import {StrictValue, VariantType} from "../../../core/Variant";

export class InputType {
  input: boolean;
  label: boolean;
  datetime: boolean;

  static Detect(model: IProperty): InputType {
    let r = new InputType();
    if (model) {
      if (model.readonly || !model.editing) {
        r.label = true;
      } else {
        r.input = true;
      }
    }
    return r;
  }
}

export class InputUtil {

  static PropertyChanged(model: IProperty) {
    // 恢复空的
    if (model.tmp == '') {
      model.tmp = model.value;
    } else {
      // 修正tmp的类型
      model.tmp = StrictValue(model.tmp, model.type);
    }
  }

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
