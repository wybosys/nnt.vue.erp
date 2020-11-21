import {IndexedMap} from "./IndexedMap";

/** 多索引map */
export class MultiMap<K, V> {
  add(k: K, v: V): this {
    let arr = this._map.objectForKey(k);
    if (arr == null) {
      arr = new Array<V>();
      this._map.add(k, arr);
    }
    arr.push(v);
    return this;
  }

  replace(k: K, v: Array<V>) {
    this._map.replace(k, v);
  }

  objectForKey(k: K): V[] {
    return this._map.objectForKey(k);
  }

  remove(k: K): V[] {
    return this._map.remove(k);
  }

  forEach(proc: (k: K, arr: V[]) => void, ctx?: any) {
    this._map.forEach(proc, ctx);
  }

  iterateEach(proc: (k: K, arr: V[]) => boolean, ctx?: any) {
    this._map.iterateEach(proc, ctx);
  }

  get keys(): Array<K> {
    return this._map.keys;
  }

  private _map = new IndexedMap<K, Array<V>>();
}
