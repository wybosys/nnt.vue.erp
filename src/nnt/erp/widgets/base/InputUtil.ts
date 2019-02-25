import {IProperty} from "../../../model/base/Property";

export class InputUtil {

  static PropertyChanged(model: IProperty) {
    // 恢复空的
    if (model.tmp == '')
      model.tmp = model.value
  }

  static PropertyIsReadonly(model: IProperty): boolean {
    if (!model)
      return true
    if (model.readonly)
      return true
    if (!model.editing)
      return true
    return false
  }

  static PropertySuffixIcon(model: IProperty): string {
    if (model.readonly)
      return null
    if (model.editing)
      return 'el-icon-edit'
    return null
  }
}
