import {ICell} from "./Cell";
import {ArrayT} from "../../core/ArrayT";
import {FieldOption, GetModel} from "../../core/Logic";

export interface IRow<T = any> {

  // 个数
  length: number;

  // 通过variable查找
  cellOfVariable(varnm: string): ICell;

  // 通过索引查找
  cellAt(idx: number): ICell;

  // 同步所有cell的改变
  sync();

  // 所有单元格
  cells: ICell[];

  // 添加单元格
  push(cell: ICell): IRow;

  // 遍历单元格
  forEach(proc: (cell: ICell, idx?: number) => void);

  // 依赖的数据
  data: T;
}

export class Row<T = any> implements IRow<T> {

  constructor(data?: T) {
    this.data = data;
  }

  data: T;

  static FromScope(scope): Row {
    let r = new Row();
    r._cells = scope.row;
    return r;
  }

  protected _cells: ICell[] = [];

  push(cell: ICell): IRow {
    this._cells.push(cell);
    return this;
  }

  get cells(): ICell[] {
    return this._cells;
  }

  get length(): number {
    return this._cells.length;
  }

  cellOfVariable(varnm: string): ICell {
    return ArrayT.QueryObject(this._cells, e => {
      return e.variable == varnm;
    });
  }

  value(varnm: string): any {
    return this.cellOfVariable(varnm).value;
  }

  current(varnm: string): any {
    return this.cellOfVariable(varnm).current;
  }

  cellAt(idx: number): ICell {
    return this._cells[idx];
  }

  sync() {
    this._cells.forEach(e => {
      e.value = e.tmp
    })
  }

  forEach(proc: (cell: ICell, idx?: number) => void) {
    this._cells.forEach(proc);
  }

  toString(): string {
    return this._cells.join('\n');
  }

  toModel<T>(model: T) {
    let fps = GetModel(model);
    if (!fps)
      return;
    for (let k in fps) {
      let fp: FieldOption = fps[k];
      if (!fp.input)
        continue;
      let cell = this.cellOfVariable(k);
      if (!cell)
        continue;
      model[k] = cell.current;
    }
  }
}
