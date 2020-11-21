import {COMPARERESULT, IndexedObject, make_tuple, tuple} from "./Kernel";
import {ObjectT} from "./ObjectT";

export class MapT {

  // 对某个key
  static Inc<K, V>(m: Map<K, V>, key: K, v: V): V {
    if (m.has(key)) {
      let cur = <any>m.get(key);
      cur += v;
      m.set(key, cur);
      return cur;
    }
    m.set(key, v);
    return v;
  }

  static Sum<K, V, R>(m: Map<K, V>, proc: (v: V, k: K) => R): R {
    let r: any = null;
    let idx = 0;
    m.forEach((v, k) => {
      if (idx++ == 0)
        r = proc(v, k);
      else
        r += proc(v, k);
    });
    return r;
  }

  static Max<K, V>(m: Map<K, V>, proc: (v: V, k: K) => V): V {
    let cur: V;
    let obj: V;
    let idx = 0;
    m.forEach((v, k) => {
      if (idx++ == 0) {
        cur = proc(v, k);
        obj = v;
        return;
      }
      let t = proc(v, k);
      if (ObjectT.Compare(cur, t) == COMPARERESULT.LESS) {
        cur = t;
        obj = v;
      }
    });
    return obj;
  }

  static Min<K, V>(m: Map<K, V>, proc: (v: V, k: K) => V): V {
    let cur: V;
    let obj: V;
    let idx = 0;
    m.forEach((v, k) => {
      if (idx++ == 0) {
        cur = proc(v, k);
        obj = v;
        return;
      }
      let t = proc(v, k);
      if (ObjectT.Compare(t, cur) == COMPARERESULT.LESS) {
        cur = t;
        obj = v;
      }
    });
    return obj;
  }

  static Foreach<K, V>(m: Map<K, V>, proc: (v: V, k: K) => boolean): boolean {
    let iter = m.entries();
    let each = iter.next();
    while (!each.done) {
      if (!proc(each.value[1], each.value[0]))
        return false;
      each = iter.next();
    }
    return true;
  }

  static SeqForeach<K, V, R>(m: Map<K, V>, proc: (v: V, k: K, next: (ret?: R) => void) => void, complete: (ret?: R) => void) {
    let iter = m.entries();

    function next(ret?: R) {
      let val = iter.next();
      if (!val.done) {
        proc(val.value[1], val.value[0], next);
      } else {
        complete(ret);
      }
    }

    next();
  }

  static QueryObjects<K, V>(m: Map<K, V>, proc: (v: V, k: K) => boolean): Array<V> {
    let r = new Array();
    m.forEach((v, k) => {
      if (proc(v, k))
        r.push(v);
    });
    return r;
  }

  static Keys<K, V>(m: Map<K, V>): K[] {
    let r = new Array<K>();
    m.forEach((v, k) => {
      r.push(k);
    });
    return r;
  }

  static Values<K, V, R>(m: Map<K, V>, proc?: (v: V, k: K) => R, skipnull = false): R[] {
    let r = new Array<R>();
    if (proc) {
      m.forEach((v, k) => {
        let t = proc(v, k);
        if (skipnull && !t)
          return;
        r.push(t);
      });
    } else {
      m.forEach((v) => {
        r.push(<any>v);
      });
    }
    return r;
  }

  static ValueAtIndex<K, V>(m: Map<K, V>, idx: number, def?: V): V {
    let iter = m.values();
    let cur = iter.next();
    while (!cur.done && idx--) {
      cur = iter.next();
    }
    return (idx > 0 || cur.done) ? def : cur.value;
  }

  static Sort<K, V>(m: Map<K, V>, proc?: (l: V, r: V) => number): tuple<K, V>[] {
    let tps = MapT.ToTuples(m);
    if (proc) {
      tps.sort((l, r) => {
        return proc(l[1], r[1]);
      });
    } else {
      tps.sort((l, r) => {
        return ObjectT.Minus(l[1], r[1]);
      });
    }
    return tps;
  }

  static ToTuples<K, V>(m: Map<K, V>): tuple<K, V>[] {
    let r = [];
    m.forEach((v, k) => {
      r.push(make_tuple(k, v));
    });
    return r;
  }

  static ToObject<K, V>(m: Map<K, V>): IndexedObject {
    let r: IndexedObject = {};
    m.forEach((v, k: any) => {
      r[k] = v;
    });
    return r;
  }

  static FromArray<K, V, R>(arr: R[], proc: (map: Map<K, V>, obj: R, idx?: number) => void, inm?: Map<K, V>): Map<K, V> {
    if (!inm)
      inm = new Map<K, V>();
    arr.forEach((e, idx) => {
      proc(inm, e, idx);
    });
    return inm;
  }
}
