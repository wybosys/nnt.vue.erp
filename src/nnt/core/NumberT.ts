import {MAX_INT} from "./Kernel";

export class NumberT {

  /** 任一数字的科学计数读法
   @return 数字部分和e的部分
   */
  static SciNot(v: number): [number, number] {
    let n = NumberT.log(v, 10);
    let l = v / Math.pow(10, n);
    return [l, n];
  }

  /** 方根 */
  static radical(v: number, x: number, n: number) {
    return Math.exp(1 / n * Math.log(x));
  }

  /** 对数 */
  static log(v: number, n: number): number {
    let r = Math.log(v) / Math.log(n) + 0.0000001;
    return r >> 0;
  }

  /** 修正为无符号 */
  static Unsigned(v: number): number {
    if (v < 0)
      return 0xFFFFFFFF + v + 1;
    return v;
  }

  /** 映射到以m为底的数 */
  static MapToBase(v: number, base: number): number {
    if (v % base == 0)
      return base;
    return v % base;
  }

  /** 运算，避免为null时候变成nan */
  static Add(v: number, r: number): number {
    if (v == null)
      v = 0;
    if (r == null)
      r = 0;
    return v + r;
  }

  static Sub(v: number, r: number): number {
    if (v == null)
      v = 0;
    if (r == null)
      r = 0;
    return v - r;
  }

  static Multiply(v: number, r: number): number {
    if (v == null)
      v = 0;
    if (r == null)
      r = 0;
    return v * r;
  }

  static Div(v: number, r: number, of: number = MAX_INT): number {
    if (v == null)
      v = 0;
    if (r == null || r == 0)
      return of;
    return v / r;
  }

  static HANMAPS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  /** 中文化数字 */
  static Hanlize(v: number): string {
    let neg;
    if (v < 0) {
      neg = true;
      v = -v;
    }
    let r = neg ? '负' : '';
    if (v <= 10)
      r += this.HANMAPS[v];
    return r;
  }

  static ToRange<T>(v: T, l: T, r: T, def: T): T {
    if (v >= l && v <= r)
      return v;
    return def;
  }

  // 设置小数精度
  // length 小数点后的位数
  static TrimFloat(v: number, length: number): number {
    let p = Math.pow(10, length);
    return Math.round(v * p) / p;
  }

  // 整数拆分
  static SplitInteger(v: number, base: number): [number, number] {
    let n = (v / base) >> 0;
    return [n, v - n * base];
  }
}
