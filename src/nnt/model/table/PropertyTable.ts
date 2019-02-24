import {IColumn} from "./Column";
import {IProperty} from "../base/Property";

export interface IPropertyTable {

  // 表栏位
  columns: IColumn[];

  // 行数据
  rows: IProperty[][];
}

export class PropertyTable implements IPropertyTable {

  // 表栏位
  columns: IColumn[] = [];

  // 行数据
  rows: IProperty[][] = [];
}
