import {Dialog, IDialog} from "./IDialog";
import {IProperty} from "../base/Property";

export interface IPropertyDialog extends IDialog {

  // 属性集合
  properties: IProperty[];

  // 增加属性
  push(p: IProperty): IPropertyDialog;

  // 获得属性
  at(idx: number): IProperty;
}

export class PropertyDialog extends Dialog implements IPropertyDialog {

  constructor(...props: IProperty[]) {
    super();
    this.properties = props ? props.concat() : [];
  }

  properties: IProperty[];

  push(p: IProperty): IPropertyDialog {
    this.properties.push(p);
    return this;
  }

  at(idx: number): IProperty {
    return this.properties[idx];
  }
}
