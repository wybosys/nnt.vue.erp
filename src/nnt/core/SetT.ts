import {CSet, SetType} from "./Stl";

/** set 的工具类 */
export class SetT {
  /** 删除对象 */
  static RemoveObject<T>(s: SetType<T>, o: T) {
    s.delete(o);
  }

  /** 复制 */
  static Clone<T>(s: SetType<T>): SetType<T> {
    let r = new CSet<T>();
    (<any>s).forEach((o: T) => {
      r.add(o);
    }, this);
    return r;
  }

  /** 转换到 array */
  static ToArray<T>(s: SetType<T>): Array<T> {
    let r = new Array<T>();
    (<any>s).forEach((o: T) => {
      r.push(o);
    }, this);
    return r;
  }

  /** 清空 */
  static Clear<T>(s: SetType<T>, cb?: (o: T) => void, ctx?: any) {
    if (s.size == 0)
      return;
    if (cb)
      (<any>s).forEach(cb, ctx);
    s.clear();
  }

  /** 带保护的清空，以避免边际效应 */
  static SafeClear<T>(s: SetType<T>, cb: (o: T) => void, ctx?: any) {
    if (s.size == 0)
      return;
    let ns: any = SetT.Clone(s);
    s.clear();
    ns.forEach(cb, ctx);
  }
}
