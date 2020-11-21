/** 随机数 */
export class Random {
  // 半开区间 [from, to)
  static Rangei(from: number, to: number, close = false): number {
    if (close)
      return Math.round(Random.Rangef(from, to));
    return Math.floor(Random.Rangef(from, to));
  }

  static Rangef(from: number, to: number): number {
    return Math.random() * (to - from) + from;
  }
}
