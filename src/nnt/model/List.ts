export interface IListItem {
  // 返回显示用的字符串
  label: string;

  // 显示图标
  icon?: string;

  // 唯一索引
  id?: any;

  // 显示的索引
  index?: number;
}

export class ListItem {

  static Text(label: string, icon?: any, id?: any): IListItem {
    return {
      label: label,
      icon: icon,
      id: id
    };
  }
}
