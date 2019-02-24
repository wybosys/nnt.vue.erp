import {ICell} from "./Cell";
import {ArrayT} from "../../core/Kernel";

export class Row {

  static CellOfVariable(row: ICell[], variable: string): ICell {
    return ArrayT.QueryObject(row, e => {
      return e.variable == variable;
    });
  }

  static SyncChanged(row: ICell[]) {
    row.forEach(e => {
      e.value = e.tmp
    })
  }
}
