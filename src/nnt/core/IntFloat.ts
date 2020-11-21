// 用int来表示float
export class IntFloat {

  constructor(ori: number = 0, s: number = 1) {
    this._ori = ori | 0;
    this._s = s;
    this._value = ori / s;
  }

  static Money(ori: number = 0): IntFloat {
    return new IntFloat(ori, 100);
  }

  static Percentage(ori: number = 0): IntFloat {
    return new IntFloat(ori, 10000);
  }

  static Origin(ori: intfloat): number {
    if (ori instanceof IntFloat)
      return ori.origin;
    throw new Error('对一个不是IntFloat的数据请求Origin');
  }

  static From(ori: intfloat, scale: number): IntFloat {
    if (ori instanceof IntFloat) {
      return new IntFloat(ori.origin, scale);
    }
    return new IntFloat(ori, scale);
  }

  static FromValue(val: intfloat, scale: number): IntFloat {
    if (val instanceof IntFloat) {
      return new IntFloat(val.origin, scale);
    }
    return new IntFloat(0, scale).setValue(val);
  }

  static Multiply(l: intfloat, r: number): intfloat {
    if (l instanceof IntFloat) {
      return l.clone().multiply(r);
    }
    throw new Error('对一个不是IntFloat的数据进行multiply操作');
  }

  static Add(l: intfloat, r: number): intfloat {
    if (l instanceof IntFloat) {
      return l.clone().add(r);
    }
    throw new Error('对一个不是IntFloat的数据进行multiply操作');
  }

  valueOf(): number {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  // 缩放后的数据，代表真实值
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
    this._ori = (v * this._s) | 0;
  }

  setValue(v: number): IntFloat {
    this.value = v;
    return this;
  }

  // 缩放前的数据
  get origin(): number {
    return this._ori;
  }

  set origin(ori: number) {
    this._ori = ori | 0;
    this._value = ori / this._s;
  }

  get scale(): number {
    return this._s;
  }

  toNumber(): number {
    return this.value;
  }

  toDouble(): number {
    return this.value;
  }

  toInt(): number {
    return this.value | 0;
  }

  toBoolean(): boolean {
    return this.value != 0;
  }

  add(r: number): this {
    this.value += r;
    return this;
  }

  multiply(r: number): this {
    this.value *= r;
    return this;
  }

  clone(): IntFloat {
    return new IntFloat(this._ori, this._s);
  }

  private _value: number; // 最终表示的float
  private _ori: number; // 当前的int
  private _s: number; // 缩放数值
}

export type intfloat = IntFloat | number;
