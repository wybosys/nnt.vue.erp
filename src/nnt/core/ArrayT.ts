import {IndexedObject} from "./Kernel";
import {ObjectT} from "./ObjectT";
import {Random} from "./Random";

/** 提供了操作 array 的工具函数 */
export class ArrayT {

  /** 生成排序用的复合hash，输入每个级别对应差值 */
  static MakeSortKey(...results): number {
    let cut = 32 - (32 / results.length | 0);
    let cutmask = 0xffffffff >> cut; // 生成用来截断数据的mask
    let r = 0;
    results.forEach(e => {
      r |= (e & cutmask) << cut;
    });
    return r;
  }

  /** 最大值 */
  static Max<T>(arr: T[]): T {
    let t = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = arr[i];
      if (t < v)
        t = v;
    }
    return t;
  }

  static QueryMax<T>(arr: T[], func?: (e: T) => any): T {
    let t = func ? func(arr[0]) : arr[0];
    let o = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = func ? func(arr[i]) : arr[i];
      if (t < v) {
        t = v;
        o = arr[i];
      }
    }
    return o;
  }

  /** 最小值 */
  static Min<T>(arr: T[]): T {
    let t = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = arr[i];
      if (t > v)
        t = v;
    }
    return t;
  }

  static QueryMin<T>(arr: T[], func?: (e: T) => any): T {
    let t = func ? func(arr[0]) : arr[0];
    let o = arr[0];
    for (let i = 1, l = arr.length; i < l; ++i) {
      let v = func ? func(arr[i]) : arr[i];
      if (t > v) {
        t = v;
        o = arr[i];
      }
    }
    return o;
  }

  /** 初始化数量 */
  static Allocate<T>(count: number, def?: any): T[] {
    let isfun = typeof (def) == 'function';
    let f = <any>def;
    let r = [];
    for (let i = 0; i < count; ++i) {
      let o = isfun ? f(i) : def;
      r.push(o);
    }
    return r;
  }

  /** 转换成数组 */
  static ToArray(o: any): any[] {
    if (o == null)
      return [];
    if (o instanceof Array)
      return o;
    return [o];
  }

  /** 合并所有的数组 */
  static Merge<T>(...arr: Array<Array<T>>): T[] {
    let r: any[] = [];
    arr.forEach((arr: Array<T>) => {
      r = r.concat(arr);
    });
    return r;
  }

  /** 使用比较函数来判断是否包含元素 */
  static Contains<L, R>(arr: L[], o: R, eqfun?: (l: L, o: R) => boolean, eqctx?: any): boolean {
    if (!arr)
      return false;
    return arr.some((each: any): boolean => {
      return ObjectT.IsEqual(each, o, eqfun, eqctx);
    }, this);
  }

  /** 合并 */
  static Concat<T>(l: T[], r: T[]): T[] {
    if (l == null)
      return r;
    if (r == null)
      return l;
    return l.concat(r);
  }

  /** 压入一组数据 */
  static PushObjects<L>(arr: L[], p: L[]) {
    p && p.forEach((e: L) => {
      arr.push(e);
    });
  }

  /** 查询 */
  static QueryObject<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: any): T {
    let r = def;
    arr.some((o: T, idx: number): boolean => {
      if (fun.call(ctx, o, idx)) {
        r = o;
        return true;
      }
      return false;
    }, this);
    return r;
  }

  /** 查找所有符合条件的对象 */
  static QueryObjects<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any): T[] {
    let r: any[] = [];
    arr.forEach((o: T, idx: number) => {
      if (fun.call(ctx, o, idx))
        r.push(o);
    });
    return r;
  }

  /** 查询条件对应的索引 */
  static QueryIndex<T>(arr: T[], fun: (o: T, idx: number) => boolean, ctx?: any, def?: number): number {
    let r = def;
    arr.some((o: T, idx: number): boolean => {
      if (fun.call(ctx, o, idx)) {
        r = idx;
        return true;
      }
      return false;
    }, this);
    return r;
  }

  /** 不为指定数据的数组长度 */
  static TrustLength<T>(arr: T[], tgt: T = null): number {
    let r = 0;
    arr.forEach((e) => {
      if (e != tgt)
        ++r;
    });
    return r;
  }

  /** 覆盖指定数据到数组 */
  static TrustAddObject<T>(arr: T[], src: T, tgt: T = null): boolean {
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] == tgt) {
        arr[i] = src;
        return true;
      }
    }
    return false;
  }

  /** 移除数据 */
  static TrustRemoveObject<T>(arr: T[], src: T, tgt: T = null) {
    let idx = arr.indexOf(src);
    if (idx == -1)
      return;
    arr[idx] = tgt;
  }

  /** 覆盖数组 */
  static TrustSet<T>(arr: T[], tgt: T[], def: T = null) {
    for (let i = 0; i < arr.length; ++i) {
      let o = tgt[i];
      arr[i] = o ? o : def;
    }
  }

  /** 弹出数据 */
  static TrustPop<T>(arr: T[], tgt: T[], def: T = null) {
    for (let i = 0; i < arr.length; ++i) {
      let o = this.RemoveObjectAtIndex(tgt, 0);
      arr[i] = o ? o : def;
    }
  }

  /** 清除 */
  static TrustClear<T>(arr: T[], tgt: T = null) {
    for (let i = 0; i < arr.length; ++i)
      arr[i] = tgt;
  }

  /** 插入元素 */
  static InsertObjectAtIndex<T>(arr: T[], o: T, idx: number) {
    arr.splice(idx, 0, o);
  }

  /** 清空数组，并挨个回调 */
  static Clear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
    if (cb)
      arr.forEach(cb, ctx);
    arr.length = 0;
  }

  /** 安全的清空，以避免边加边删的边际效应 */
  static SafeClear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
    ArrayT.Clear(ArrayT.Clone(arr), cb, ctx);
    arr.length = 0;
  }

  /** 安全的增加，如果为null，则推入def，如果def也是null，则不推入 */
  static SafePush<T>(arr: T[], o: T, def?: T) {
    let obj = o ? o : def;
    if (obj)
      arr.push(obj);
  }

  /** 填充一个数组 */
  static Fill<T>(arr: T[], cnt: number, instance: () => any, ctx?: any): T[] {
    if (arr == null)
      arr = [];
    while (cnt--) {
      arr.push(instance.call(ctx));
    }
    return arr;
  }

  /** 使用类型来自动实例化并填充数组 */
  static FillType<T>(arr: T[], cnt: number, cls: any): T[] {
    if (arr == null)
      arr = [];
    while (cnt--) {
      arr.push(new cls());
    }
    return arr;
  }

  /** 带保护的两两遍历 */
  static ForeachWithArray(arrl: any[], arrr: any[], cb: (l: any, r: any, idx: number) => void, ctx?: any, def?: any) {
    let cntl = arrl.length, cntr = arrr.length;
    let cnt = Math.max(cntl, cntr);
    for (let i = 0; i < cnt; ++i) {
      let ol = i < cntl ? arrl[i] : def;
      let or = i < cntr ? arrr[i] : def;
      cb.call(ctx, ol, or, i);
    }
  }

  /** 带 break 的索引遍历 */
  static Foreach<T>(arr: T[], cb: (o: T, idx: number) => boolean, ctx?: any) {
    arr.every((each: any, idx: number): boolean => {
      return cb.call(ctx, each, idx);
    }, this);
  }

  /** 按照行来遍历 */
  static ForeachRow<T>(arr: T[], columns: number, cb: (o: T, row: number, col: number, idx?: number, rows?: number) => boolean, ctx?: any) {
    let rows = Math.ceil(arr.length / columns);
    for (let r = 0; r < rows; ++r) {
      for (let c = 0; c < columns; ++c) {
        let i = r * columns + c;
        if (cb.call(ctx, arr[i], r, c, i, rows) == false)
          return;
      }
    }
  }

  /** 随机一个 */
  static Random<T>(arr: T[]): T {
    if (arr.length == 0)
      return null;
    return arr[Random.Rangei(0, arr.length)];
  }

  /** 安全的遍历，以避免边删边加的边际效应 */
  static SafeForeach(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any) {
    ArrayT.Foreach(ArrayT.Clone(arr), cb, ctx);
  }

  /** 迭代数组，提供结束的标识 */
  static Iterate<T>(arr: T[], cb: (o: T, idx: number, end: boolean) => boolean, ctx: any) {
    if (arr.length == 0)
      return;
    let len = arr.length - 1;
    ArrayT.Foreach(arr, function (o: any, idx: number): boolean {
      return cb.call(ctx, o, idx, idx == len);
    }, ctx);
  }

  /** 使用指定索引全遍历数组，包括索引外的 */
  static FullEach<T>(arr: T[], idx: number, cbin: (o: T, idx: number) => void, cbout: (o: T, idx: number) => void) {
    let len = Math.min(arr.length, idx);
    for (let i = 0; i < len; ++i) {
      cbin(arr[i], i);
    }
    if (len >= idx) {
      len = arr.length;
      for (let i = idx; i < len; ++i) {
        cbout(arr[i], i);
      }
    }
  }

  /** 带筛选器的统计个数 */
  static LengthQuery(arr: any[], cb: (o: any, idx: number) => boolean, ctx: any): number {
    let ret: number = 0;
    arr.forEach((each: any, idx: number) => {
      if (cb.call(ctx, each, idx))
        ret += 1;
    }, this);
    return ret;
  }

  /** 删除一个对象 */
  static RemoveObject<T>(arr: T[], obj: T): boolean {
    if (obj == null || arr == null)
      return false;
    let idx = arr.indexOf(obj);
    arr.splice(idx, 1);
    return true;
  }

  /** 删除指定索引的对象 */
  static RemoveObjectAtIndex<T>(arr: T[], idx: number): T {
    let r = arr.splice(idx, 1);
    return r[0];
  }

  /** 使用筛选器来删除对象 */
  static RemoveObjectByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T {
    for (let i = 0; i < arr.length; ++i) {
      let e = arr[i];
      if (filter.call(ctx, e, i)) {
        arr.splice(i, 1);
        return e;
      }
    }
    return null;
  }

  static RemoveObjectsByFilter<T>(arr: T[], filter: (o: T, idx: number) => boolean, ctx?: any): T[] {
    let r: any[] = [];
    let res = arr.filter((o, idx): boolean => {
      if (filter.call(ctx, o, idx)) {
        r.push(o);
        return false
      }
      return true;
    }, this);
    if (arr.length == res.length)
      return r;
    ArrayT.Set(arr, res);
    return r;
  }

  /** 移除位于另一个 array 中的所有元素 */
  static RemoveObjectsInArray<T>(arr: T[], r: T[]) {
    let res = arr.filter((each: any, idx: number): boolean => {
      return !ArrayT.Contains(r, each);
    }, this);
    ArrayT.Set(arr, res);
  }

  /** 使用位于另一个 array 中对应下标的元素 */
  static RemoveObjectsInIndexArray<T>(arr: T[], r: number[]): T[] {
    let rm: any[] = [];
    let res = arr.filter((each: T, idx: number): boolean => {
      if (ArrayT.Contains(r, idx) == true) {
        rm.push(each);
        return false;
      }
      return true;
    }, this);
    ArrayT.Set(arr, res);
    return rm;
  }

  /** 调整大小 */
  static Resize<T>(arr: T[], size: number, def?: T) {
    if (arr.length < size) {
      let cnt = size - arr.length;
      let base = arr.length;
      for (let i = 0; i < cnt; ++i) {
        arr.push(def);
      }
    } else if (arr.length > size) {
      arr.length = size;
    }
  }

  /** 上浮满足需求的对象 */
  static Rise<T>(arr: T[], q: (e: T) => boolean) {
    let r: any[] = [];
    let n: any[] = [];
    arr.forEach((e: T) => {
      if (q(e))
        r.push(e);
      else
        n.push(e);
    });
    this.Set(arr, r.concat(n));
  }

  /** 下沉满足需求的对象 */
  static Sink<T>(arr: T[], q: (e: T) => boolean) {
    let r: any[] = [];
    let n: any[] = [];
    arr.forEach((e: T) => {
      if (q(e))
        r.push(e);
      else
        n.push(e);
    });
    this.Set(arr, n.concat(r));
  }

  /** 使用另一个数组来填充当前数组 */
  static Set<T>(arr: T[], r: T[]) {
    arr.length = 0;
    r.forEach((o) => {
      arr.push(o);
    }, this);
  }

  /** 复制 */
  static Clone<T>(arr: T[]): T[] {
    return arr.concat();
  }

  /** 转换 */
  static Convert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r: any[] = [];
    arr.forEach((o: L, idx: number) => {
      r.push(convert.call(ctx, o, idx));
    });
    return r;
  }

  /** 安全转换，如果结果为null，则跳过 */
  static SafeConvert<L, R>(arr: L[], convert: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r: any[] = [];
    arr.forEach((o: L, idx: number) => {
      let t = convert.call(ctx, o, idx);
      if (t)
        r.push(t);
    });
    return r;
  }

  /** 提取 */
  static Filter<L, R>(arr: L[], filter: (o: L, idx?: number) => R, ctx?: any): R[] {
    let r: any[] = [];
    arr.forEach((o: L, idx: number) => {
      let r = filter.call(ctx, o, idx);
      if (r)
        r.push(r);
    });
    return r;
  }

  /** 数组 l 和 r 的共有项目 */
  static ArrayInArray<T>(l: T[], r: T[]): T[] {
    return l.filter((o): boolean => {
      return ArrayT.Contains(r, o);
    }, this);
  }

  /** 合并 */
  static Combine<T>(l: T[], sep: any): any {
    let r = l[0];
    for (let i = 1; i < l.length; i++) {
      r += sep + l[i];
    }
    return r;
  }

  /** 检查两个是否一样 */
  static EqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l.length != r.length)
      return false;
    return r.every((o: any): boolean => {
      return ArrayT.Contains(l, o, eqfun, eqctx);
    }, this);
  }

  /** 严格(包含次序)检查两个是否一样 */
  static StrictEqualTo<L, R>(l: L[], r: R[], eqfun?: (l: L, r: R) => boolean, eqctx?: any): boolean {
    if (l.length != r.length)
      return false;
    return r.every((o: any, idx: number): boolean => {
      return ObjectT.IsEqual(o, r[idx], eqfun, eqctx);
    }, this);
  }

  /** 乱序 */
  static Disorder<T>(arr: T[]) {
    arr.sort((): number => {
      return Math.random();
    });
  }

  /** 截取尾部的空对象 */
  static Trim<T>(arr: T[], emp: T = null) {
    let t = [];
    for (let i = arr.length; i != 0; --i) {
      let o = arr[i - 1];
      if (t.length == 0 && o == emp)
        continue;
      t.push(o);
    }
    ArrayT.Set(arr, t.reverse());
  }

  /** 去重 */
  static HashUnique<T>(arr: T[], hash: boolean = true) {
    let t: any[] = [];
    if (hash) {
      let h: IndexedObject = {};
      arr.forEach((o: any) => {
        let k = o.hashCode;
        if (h[k])
          return;
        t.push(o);
        h[k] = true;
      });
    } else {
      arr.forEach((o: any) => {
        if (t.indexOf(o) == -1)
          t.push(o);
      });
    }
    this.Set(arr, t);
  }

  static Unique<T>(arr: T[], eqfun?: (l: T, o: T) => boolean, eqctx?: any) {
    let t: any[] = [];
    arr.forEach((o: any) => {
      if (this.Contains(t, o, eqfun, eqctx) == false)
        t.push(o);
    });
    this.Set(arr, t);
  }

  /** 取得一段 */
  static RangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
    let n = arr.length;
    if (pos < 0) {
      pos = n + pos;
      if (pos < 0)
        return arr;
    }
    if (pos >= n)
      return [];
    let c = len == null ? n : pos + len;
    return arr.slice(pos, c);
  }

  /** 弹出一段 */
  static PopRangeOf<T>(arr: Array<T>, pos: number, len?: number): Array<T> {
    let n = arr.length;
    if (pos < 0) {
      pos = n + pos;
      if (pos < 0) {
        let r = arr.concat();
        arr.length = 0;
        return r;
      }
    }
    if (pos >= n)
      return [];
    let c = len == null ? n - pos : len;
    return arr.splice(pos, c);
  }

  /** 根据长度拆成几个Array */
  static SplitByLength<T>(arr: Array<T>, len: number): Array<Array<T>> {
    let r = [];
    let n = Math.ceil(arr.length / len);
    for (let i = 0; i < n; ++i) {
      r.push(this.RangeOf(arr, i * len, len));
    }
    return r;
  }

  /** 快速返回下一个或上一个 */
  static Next<T>(arr: Array<T>, obj: T, def?: T): T {
    let idx = arr.indexOf(obj);
    if (idx == -1)
      return def;
    if (idx + 1 == arr.length)
      return def;
    return arr[idx + 1];
  }

  static Previous<T>(arr: Array<T>, obj: T, def?: T): T {
    let idx = arr.indexOf(obj);
    if (idx == -1)
      return def;
    if (idx == 0)
      return def;
    return arr[idx - 1];
  }
}
