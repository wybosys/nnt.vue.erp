import {Serie} from "./Serie";

export class Series {

  protected _series: Serie[] = [];

  clear(): this {
    this._series = [];
    return this;
  }

  add(s: Serie): this {
    this._series.push(s);
    return this;
  }
}
