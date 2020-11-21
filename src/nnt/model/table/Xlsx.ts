import {IPropertyTable} from "./PropertyTable";
import {ArrayT} from "../../core/ArrayT";
import {SendToDownload, StringToBlob} from "../../core/Dom";

const xlsx = require('xlsx');

export class Sheet {

  constructor(name = 'sheet') {
    this.name = name;
  }

  // 从table转换成sheet
  appendPropertyTable(pt: IPropertyTable): this {
    this.datas.push(ArrayT.Convert(pt.columns, e => {
      return e.label;
    }));
    pt.rows.forEach(row => {
      this.datas.push(ArrayT.Convert(row.cells, e => {
        return e.tmp;
      }));
    });
    return this;
  }

  clear(): this {
    this.datas.length = 0;
    return this;
  }

  name: string;
  datas: any[][] = [];
}

export class Xlsx {

  save(file: string = 'exported') {
    let doc = xlsx.utils.book_new();
    this.sheets.forEach((e, ei) => {
      let sh = xlsx.utils.json_to_sheet(e.datas);
      let dnm = ArrayT.QueryObject(this.sheets, s => {
        return s.name == e.name;
      });
      let name = (dnm && dnm != e) ? `${e.name}${ei}` : e.name;
      xlsx.utils.book_append_sheet(doc, sh, name);
    });
    let out = xlsx.write(doc, {
      type: "binary"
    });
    SendToDownload(StringToBlob(out), `${file}.xlsx`);
  }

  clear(): this {
    this.sheets.length = 0;
    return this;
  }

  sheets: Sheet[] = [];
}
