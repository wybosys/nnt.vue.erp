/** 序列化的接口 */
import {CMap, CSet} from "./Stl";
import {Signals} from "./Signals";

export type tuple<A, B> = { 0: A, 1: B };
export type tuple2<A, B> = { 0: A, 1: B };
export type tuple3<A, B, C> = { 0: A, 1: B, 2: C };
export type tuple4<A, B, C, D> = { 0: A, 1: B, 2: C, 3: D };

export function make_tuple<A, B>(a: A, b: B): tuple<A, B> {
  return {0: a, 1: b};
}

export function make_tuple2<A, B>(a: A, b: B): tuple<A, B> {
  return {0: a, 1: b};
}

export function make_tuple3<A, B, C>(a: A, b: B, c: C): tuple3<A, B, C> {
  return {0: a, 1: b, 2: c};
}

export function make_tuple4<A, B, C, D>(a: A, b: B, c: C, d: D): tuple4<A, B, C, D> {
  return {0: a, 1: b, 2: c, 3: d};
}

export function use<T>(v: T, proc: (v: T) => void): T {
  proc(v);
  return v;
}

function _istuple(obj: any, len = 2): boolean {
  if (!(typeof obj == "object"))
    return false;
  for (let i = 0; i < len; ++i) {
    if (obj.hasOwnProperty(i) == false)
      return false;
  }
  return true;
}

export function IsTuple(obj: any): boolean {
  return _istuple(obj, 2);
}

export function IsTuple3(obj: any): boolean {
  return _istuple(obj, 3);
}

export function IsTuple4(obj: any): boolean {
  return _istuple(obj, 4);
}

export type IndexedKeyType = string | number | boolean;
export type IndexedObject = {
  [key: string]: any
  [key: number]: any
};
export type IndexedType<T> = {
  [key: string]: T
  [key: number]: T
};

// 默认的时间单位，秒
export type Interval = number;

/** 基础数字＋字符串 */
export type numstr = number | string | any;

/** JSONOBJ+字符串 */
export type jsonobj = string | IndexedObject;

/** 增加引用计数 */
export function grab<T>(o: T): T {
  if (o == null)
    return undefined;
  (<any>o).grab();
  return o;
}

/** 减计数对象 */
export function drop<T>(o: T): T {
  if (o == null)
    return undefined;
  return (<any>o).drop();
}

/** 直接析构一个对象 */
export function dispose<T>(o: T) {
  if (o == null)
    return;
  (<any>o).dispose();
}

/** 带保护的取一堆中第一个不是空的值 */
export function nonnull1st<T>(def: T, ...p: T[]) {
  for (let i = 0; i < p.length; ++i) {
    let v = p[i];
    if (v != null)
      return v;
  }
  return def;
}

// 生成IndexedObject
// args (key,value)+，如果是奇数，则0下标的为给特定的object增加kv
// 常用来构造key为变量的IndexedObject
export function indexed(...args: any[]): IndexedObject {
  let r: IndexedObject;
  let lb: number;
  if (args.length % 2) {
    r = args[0];
    lb = 1;
  } else {
    r = {};
    lb = 0;
  }
  for (let i = lb, l = args.length; i < l; i += 2) {
    let k = args[i];
    let v = args[i + 1];
    r[k] = v;
  }
  return r;
}

export function indexed_safe(...args: any[]): IndexedObject {
  let r: IndexedObject;
  let lb: number;
  if (args.length % 2) {
    r = args[0];
    lb = 1;
  } else {
    r = {};
    lb = 0;
  }
  for (let i = lb, l = args.length; i < l; i += 2) {
    let k = args[i];
    let v = args[i + 1];
    if (k == null || v == null)
      continue;
    r[k] = v;
  }
  return r;
}

/** 带保护的判断对象是不是 0 */
export function isZero(o: any): boolean {
  if (o == null || o == 0)
    return true;
  if (o.length)
    return o.length == 0;
  return false;
}

function SafeNumber(o: number, def = 0): number {
  return isNaN(o) ? def : o;
}

/** 转换到 float */
export function toDouble(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof (o);
  if (tp == 'number')
    return SafeNumber(o, def);
  if (tp == 'string') {
    let v = parseFloat(o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber();
  return def;
}

/** 转换到 int */
export function toInt(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof (o);
  if (tp == 'number' || tp == 'string') {
    let v = parseInt(o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber() >> 0;
  return def;
}

/** 转换到数字
 @brief 如果对象不能直接转换，会尝试调用对象的 toNumber 进行转换
 */
export function toNumber(o: any, def = 0): number {
  if (o == null)
    return def;
  let tp = typeof (o);
  if (tp == 'number')
    return SafeNumber(o, def);
  if (tp == 'string') {
    let v = Number(<string>o);
    return SafeNumber(v, def);
  }
  if (o.toNumber)
    return o.toNumber();
  return def;
}

export function toBoolean(o: any, def = false): boolean {
  if (o == null)
    return def;
  if (typeof o == 'string') {
    if (o == 'true' || o == '1')
      return true;
    if (o == 'false' || o == '0')
      return false;
    return def;
  }
  return !!o;
}

/** 转换到字符串 */
export function asString(o: any, def = ''): string {
  if (o == null)
    return def;
  let tp = typeof (o);
  if (tp == 'string')
    return o;
  if (tp == 'number')
    return SafeNumber(o).toString();
  if (o.toString)
    return o.toString();
  return def;
}

/** 转换到json字串 */
export function toJson(o: any, def: string = null): string {
  let t = typeof (o);
  if (t == 'string')
    return o;
  let r = null;
  try {
    r = JSON.stringify(o);
  } catch (ex) {
    r = def;
  }
  return r;
}

/** 转换到对象 */
export function toJsonObject(o: jsonobj, def = null): IndexedObject {
  let t = typeof (o);
  if (t == 'string') {
    try {
      return JSON.parse(<string>o);
    } catch (e) {
      return def;
    }
  } else if (t == 'object')
    return <IndexedObject>o;
  return def;
}

/** json处理，保护防止crash并且打印出数据 */
export function json_encode(obj: Object): string {
  return JSON.stringify(obj);
}

export function json_decode(str: string): any {
  let r;
  try {
    r = JSON.parse(str);
  } catch (err) {
    console.exception(err);
  }
  return r;
}

/** 带保护的判断对象是不是空 */
export function IsEmpty(o: any): boolean {
  if (o == null)
    return true;
  let tp = typeof (o);
  if (tp == 'string') {
    if (tp.length == 0)
      return true;
    return o.match(/^\s*$/) != null;
  }
  if (o instanceof Array) {
    return (<any>o).length == 0;
  }
  if (o instanceof CMap) {
    return (<CMap<any, any>>o).length != 0;
  }
  if (o instanceof CSet) {
    return (<CSet<any>>o).size != 0;
  }
  return Object.keys(o).length == 0;
}

export interface ISerializable {
  /** 序列化对象到流，返回结果 */
  serialize(stream: any): any;

  /** 从流中构建对象 */
  unserialize(stream: any): boolean;
}

/** 缓存策略控制接口 */
export interface ICacheObject {
  // 是否强制刷新
  cacheFlush: boolean;

  // 是否已经更新
  cacheUpdated: boolean;

  // 过期的时间段
  cacheTime: number;

  // 获得唯一标记
  keyForCache(): string;

  // 值
  valueForCache(): any;
}

/** 基类的接口 */
export interface IObject {
  dispose(): void;
}

/** 引用计数的接口 */
export interface IReference {
  drop(): void;

  grab(): void;
}

/** 默认的Object接口 */
export interface IRefObject extends IObject, IReference {
}

export interface ISObject {
  signals: Signals;
}

export const MAX_LONG = Number.MAX_SAFE_INTEGER;
export const MIN_LONG = Number.MIN_SAFE_INTEGER;
export const MAX_INT = 0x7fffffff;
export const MIN_INT = -MAX_INT;

export enum COMPARERESULT {
  EQUAL = 0,
  GREATER = 1,
  LESS = -1,
}

export function Delay(sec: Interval, cb: Function, ctx?: any) {
  setTimeout(() => {
    cb.call(ctx);
  }, sec * 1000);
}

export function Defer(cb: Function, ctx?: any) {
  setTimeout(() => {
    cb.call(ctx);
  }, 0);
}

/** 全局的不可释放的唯一实例 */
export interface IShared {
  // 约定该实例名称为shared
  // static shared = new IMPL_TYPE();
}

export interface ICacheRecord extends IReference {
  /** 使用缓存的实际数据对象 */
  use(): any;

  /** 设置缓存的实际数据对象的属性，如果isnull跳过 */
  prop(k: any, v: any): void;

  /** 是否为空 */
  isnull: boolean;
}

/** 错误的类型 */
export class Failed {
  constructor(code: number, msg?: string, lmsg?: string) {
    this.code = code;
    this.message = msg;
    if (lmsg == null)
      lmsg = msg;
    this.locationMessage = lmsg;
  }

  message: string;
  locationMessage: string;
  code: number;
  line: number;

  toString(): string {
    return this.code + ': ' + this.locationMessage;
  }
}

/** 编解码 */
export interface ICodec {
  /** 编码 */
  encode(s: string): string;

  /** 解码 */
  decode(d: any): string;
}

