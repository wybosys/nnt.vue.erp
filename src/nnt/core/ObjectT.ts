import {COMPARERESULT, IndexedKeyType, IndexedObject} from "./Kernel";
import {KvObject} from "./Stl";

/** 提供操作基础对象的工具函数 */
export class ObjectT {

  // 任意对象的比较
  static Compare(l: any, r: any): COMPARERESULT {
    if (l > r)
      return COMPARERESULT.GREATER;
    if (l < r)
      return COMPARERESULT.LESS;
    return COMPARERESULT.EQUAL;
  }

  static Minus(l: any, r: any): number {
    return l - r;
  }

  static Max<T>(l: T, r: T): T {
    return ObjectT.Compare(l, r) == COMPARERESULT.GREATER ? l : r;
  }

  static Min<T>(l: T, r: T): T {
    return ObjectT.Compare(l, r) == COMPARERESULT.LESS ? l : r;
  }

  /** 获取 */
  static Get<V>(m: KvObject<V>, k: IndexedKeyType): V {
    let a = Object();
    return m[<any>k];
  }

  /** 获取所有的value */
  static GetValues<V>(m: KvObject<V>): Array<V> {
    let r: any[] = [];
    this.Foreach(m, (k, v) => {
      r.push(v);
    });
    return r;
  }

  /** 增加 */
  static Add<V>(m: KvObject<V>, k: IndexedKeyType, v: V) {
    m[<any>k] = v;
  }

  /** 遍历 */
  static Foreach<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => void, ctx?: any) {
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      fun.call(ctx, k, m[k]);
    }, this);
  }

  /** 转换 */
  static ToArray<V, T>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => T, ctx?: any): Array<T> {
    let r: any[] = [];
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      let obj = fun.call(ctx, k, m[k]);
      r.push(obj);
    }, this);
    return r;
  }

  static SafeToArray<V, T>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => T, ctx?: any): Array<T> {
    let r: any[] = [];
    let keys = Object.keys(m);
    keys.forEach((k: any) => {
      let obj = fun.call(ctx, k, m[k]);
      if (obj)
        r.push(obj);
    }, this);
    return r;
  }

  /** 取值 */
  static QueryObject<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): [IndexedKeyType, V] {
    let keys = Object.keys(m);
    for (let i = 0; i < keys.length; ++i) {
      let k = keys[i];
      if (fun.call(ctx, k, m[k]))
        return [<any>k, m[k]];
    }
    return null;
  }

  static QueryObjects<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): KvObject<V> {
    let keys = Object.keys(m);
    let r: any = {};
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r[k] = v;
    });
    return r;
  }

  /** 获取值 */
  static QueryValue<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): V {
    let fnd = this.QueryObject(m, fun, ctx);
    return fnd ? fnd[1] : null;
  }

  static QueryValues<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): V[] {
    let keys = Object.keys(m);
    let r: any = [];
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r.push(v);
    });
    return r;
  }

  static QueryKey<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): IndexedKeyType {
    let fnd = this.QueryObject(m, fun, ctx);
    return fnd ? fnd[0] : null;
  }

  static QueryKeys<V>(m: KvObject<V>, fun: (k: IndexedKeyType, v: V) => boolean, ctx?: any): IndexedKeyType[] {
    let keys = Object.keys(m);
    let r: any = [];
    keys.forEach((k) => {
      let v = m[k];
      if (fun.call(ctx, k, v))
        r.push(k);
    });
    return r;
  }

  /** 判断是否为空 */
  static IsEmpty<V>(m: KvObject<V>): boolean {
    if (m == null)
      return true;
    return Object.keys(m).length == 0;
  }

  /** 删除key的元素 */
  static RemoveKey<V>(m: KvObject<V>, k: IndexedKeyType) {
    delete m[<any>k];
  }

  /** 清空 */
  static Clear<V>(m: KvObject<V>, cb?: (k: IndexedKeyType, o: V) => void, ctx?: any) {
    this.Foreach(m, (k: IndexedKeyType, v: V) => {
      if (cb)
        cb.call(ctx, k, v);
      delete m[<any>k];
    }, this);
  }

  /** 合并 */
  static Concat<V>(l: KvObject<V>, r: KvObject<V>) {
    if (l == null)
      return r;
    if (r == null)
      return l;
    this.Foreach(r, (k, v) => {
      l[<any>k] = v;
    }, this);
  }

  /** 复制 */
  static Clone<V>(l: KvObject<V>): KvObject<V> {
    let r = new KvObject<V>();
    this.Foreach(l, (k: any, v) => {
      r[k] = v;
    }, this);
    return r;
  }

  /** 获取长度 */
  static Length<T>(m: T): number {
    return Object.keys(m).length;
  }

  /** 转换成普通Object */
  static Simplify<V>(m: KvObject<V>): IndexedObject {
    let obj: IndexedObject = {};
    this.Foreach(m, (k, v) => {
      obj[<any>k] = <any>v;
    });
    return obj;
  }

  /** 比较两个实例是否相等
   @brief 优先使用比较函数的结果
   */
  static IsEqual<L, R>(l: L, r: R, eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l == null || r == null)
      return false;
    if (eqfun)
      return eqfun.call(eqctx, l, r);
    if (l && (<any>l).isEqual)
      return (<any>l).isEqual(r);
    if (r && (<any>r).isEqual)
      return (<any>r).isEqual(l);
    return <any>l == <any>r;
  }

  /** 根据查询路径获取值 */
  static GetValueByKeyPath(o: any, kp: string, def?: any): any {
    if (o == null)
      return def;
    let ks = kp.split('.');
    for (let i = 0; i < ks.length; ++i) {
      o = o[ks[i]];
      if (o == null)
        return def;
    }
    return o;
  }

  /** 根据查询路径设置值 */
  static SetValueByKeyPath(o: any, kp: string, v: any) {
    if (o == null) {
      console.warn("不能对null进行keypath的设置操作");
      return;
    }
    let ks = kp.split('.');
    let l = ks.length - 1;
    for (let i = 0; i < l; ++i) {
      let k = ks[i];
      let t = o[k];
      if (t == null) {
        t = {};
        o[k] = t;
      }
      o = t;
    }
    o[ks[l]] = v;
  }
}
