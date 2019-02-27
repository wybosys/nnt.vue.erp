import {IColumn} from "./Column";
import {IProperty} from "../base/Property";

export interface IPropertyTable {

  // 表栏位
  columns: IColumn[];

  // 行数据
  rows: IProperty[][];

  // 是否可以编辑
  editable: boolean;

  // 是否可以删除
  removable: boolean;

  // 是否可以增加
  creatable: boolean;

  // 是否可以刷新
  refreshable: boolean;

}

export class PropertyTable implements IPropertyTable {

  // 表栏位
  columns: IColumn[] = [];

  // 行数据
  rows: IProperty[][] = [];

  // 是否可以编辑
  editable: boolean = true;

  // 是否可以删除
  removable: boolean;

  // 是否可以增加
  creatable: boolean;

  // 是否可以刷新
  refreshable: boolean = true;

  // 当前表格宽度扩展几倍
  multiple: number = 1;

}
