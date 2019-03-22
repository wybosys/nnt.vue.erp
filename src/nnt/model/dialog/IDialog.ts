export interface IDialog {

  // 是否显示
  visible: boolean;
}

export class Dialog implements IDialog {

  visible: boolean = false;
}
