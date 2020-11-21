import {ArrayT} from "./ArrayT";
import {IndexedObject} from "./Kernel";

export class IndexedMap<K, T> {
  constructor() {
  }

  /** 添加 */
  add(k: K, v: T) {
    if (<any>k in this._map) {
      let idx = this._keys.indexOf(k);
      this._keys[idx] = k;
      this._vals[idx] = v;
    } else {
      this._keys.push(k);
      this._vals.push(v);
    }

    this._map[<any>k] = v;
  }

  /** 替换 */
  replace(k: K, v: T) {
    if (<any>k in this._map) {
      let idx = this._keys.indexOf(k);
      this._vals[idx] = v;
    } else {
      this._keys.push(k);
      this._vals.push(v);
    }

    this._map[<any>k] = v;
  }

  /** 删除 */
  remove(k: K): T {
    if (!(<any>k in this._map))
      return null;

    // k和v是1-1，所以indexOfKey和indexOfVal一致
    let idx = this._keys.indexOf(k);
    let val = this._vals[idx];
    ArrayT.RemoveObjectAtIndex(this._keys, idx);
    ArrayT.RemoveObjectAtIndex(this._vals, idx);

    delete this._map[<any>k];
    return val;
  }

  /** 获得大小 */
  get length(): number {
    return this._keys.length;
  }

  /** 清空 */
  clear() {
    this._keys.length = 0;
    this._vals.length = 0;
    this._map = {};
  }

  /** 遍历 */
  forEach(cb: (k: K, v: T) => void, ctx?: any) {
    this._keys.forEach((k: K, idx: number) => {
      let v = this._vals[idx];
      cb.call(ctx, k, v);
    }, this);
  }

  iterateEach(cb: (k: K, v: T) => boolean, ctx?: any) {
    for (let i = 0, len = this._keys.length; i < len; ++i) {
      let k = this._keys[i];
      let v = this._vals[i];
      if (!cb.call(ctx, k, v))
        break;
    }
  }

  /** 是否存在k */
  contains(k: K): boolean {
    return <any>k in this._map;
  }

  /** 取得k的下标 */
  indexOfKey(k: K): number {
    return this._keys.indexOf(k);
  }

  /** 使用下标取得数据 */
  objectForKey(k: K): T {
    return this._map[<any>k];
  }

  objectForIndex(idx: number): T {
    let k: any = this._keys[idx];
    return this._map[k];
  }

  keyForIndex(idx: number): K {
    return this._keys[idx];
  }

  get keys(): Array<K> {
    return this._keys.concat();
  }

  get values(): Array<T> {
    return this._vals;
  }

  private _map: IndexedObject = {};
  private _keys = new Array<K>();
  private _vals = new Array<T>();
}

export class IndexedMapT {
  static RemoveObjectByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): [K, T] {
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (filter.call(ctx, k, v)) {
        map.remove(k);
        return [k, v];
      }
    }
    return null;
  }

  static RemoveObjectsByFilter<K, T>(map: IndexedMap<K, T>, filter: (k: K, v: T) => boolean, ctx?: any): Array<[K, T]> {
    let r = new Array<[K, T]>();
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (filter.call(ctx, k, v)) {
        map.remove(k);
        r.push([k, v]);
      }
    }
    return r;
  }

  static QueryObject<K, T>(map: IndexedMap<K, T>, query: (k: K, v: T) => boolean, ctx?: any): T {
    let keys = map.keys;
    for (let i = 0, len = keys.length; i < len; ++i) {
      let k = keys[i];
      let v = map.objectForKey(k);
      if (query.call(ctx, k, v))
        return v;
    }
    return null;
  }

  static Convert<K, T, V>(arr: Array<V>, convert: (v: V) => [K, T], ctx?: any): IndexedMap<K, T> {
    let r = new IndexedMap<K, T>();
    arr.forEach((e: V) => {
      let o = convert.call(ctx, e);
      r.add(o[0], o[1]);
    });
    return r;
  }
}
