import {ArrayT, drop} from "./Kernel";

export class ObjectReference {
  object: any;
}

export function nonenum(obj?: any, objkey?: string): (target: any, key: string, desc?: PropertyDescriptor) => void {
  if (obj && objkey) {
    let info = Object.getOwnPropertyDescriptor(obj, objkey);
    if (info) {
      info.enumerable = false;
      Object.defineProperty(obj, objkey, info);
    } else {
      Object.defineProperty(obj, objkey, {
        enumerable: false
      });
    }
    return;
  }
  return (target, key, desc) => {
    // 普通函数
    desc.enumerable = false;
  };
}

function ObjectPrototype(o: any): any {
  if (o == null)
    return null;
  let p = o['prototype'];
  return p ? p : o['__proto__'];
}

export function ObjectClass(o: any): any {
  if (o == null)
    return Object;
  return ObjectPrototype(o)['constructor'];
}

export function Classname(cls: any): string {
  return ObjectPrototype(cls)['__class__'];
}

export function SuperClass(o: any): any {
  return ObjectPrototype(ObjectPrototype(o));
}

export function IsInherit(type: Function, parent: Function): boolean {
  let c = ObjectPrototype(type);
  let t = ObjectPrototype(parent);
  while (c && c != t) {
    c = ObjectPrototype(c); //js的特殊性
  }
  return !!(c && c == t);
}

/** 带参数的实例化对象 */
export function NewObject(cls: any, p: any[]): any {
  let len = p.length;
  if (len == 0)
    return new cls();
  if (len == 1)
    return new cls(p[0]);
  if (len == 2)
    return new cls(p[0], p[1]);
  if (len == 3)
    return new cls(p[0], p[1], p[2]);
  if (len == 4)
    return new cls(p[0], p[1], p[2], p[3]);
  if (len == 5)
    return new cls(p[0], p[1], p[2], p[3], p[4]);
  if (len == 6)
    return new cls(p[0], p[1], p[2], p[3], p[4], p[5]);
  if (len == 7)
    return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6]);
  if (len == 8)
    return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
  if (len == 9)
    return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8]);
  if (len == 10)
    return new cls(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9]);
  console.error("Typescript没有对 " + len + " 个参数的的 NewObject 实现");
  return null;
}

export function InstanceNewObject<T>(o: T, ...p: any[]): T {
  let cls = ObjectClass(o);
  return NewObject(cls, p);
}

export function MethodIsOverrided(cls: any, method: string) {
  return ObjectPrototype(cls)[method] != SuperClass(cls)[method];
}

export function HasMethod(cls: any, method: string): boolean {
  return ObjectPrototype(cls)[method] != undefined;
}

export function Method(obj: any, method: string): any {
  return ObjectPrototype(obj)[method];
}

export class Class<T> {
  constructor(type?: any) {
    this.type = type;
  }

  type: any;

  instance(): T {
    if (this.type == null)
      return null;
    return new this.type();
  }

  isEqual<R>(r: Class<R>): boolean {
    return this.type == r.type;
  }
}

/** 实例的容器
 @note 承载实例好的对象或者延迟实例化的类，但是暴露出去的都是实例
 */
export class Instance<T> {
  constructor(o: T | Function) {
    if (typeof (o) == 'function') {
      this._clazz = <Function>o;
    } else {
      this._obj = <any>o;
    }
  }

  drop() {
    this._obj = drop(this._obj);
  }

  get obj(): T {
    if (this._obj == null) {
      let clz: any = this._clazz;
      this._obj = new clz();
    }
    return this._obj;
  }

  get clazz(): any {
    return this._clazz;
  }

  isnull(): boolean {
    if (this._obj == null)
      return true;
    if ((<any>this._obj).__disposed == true)
      return true;
    return false;
  }

  private _obj: T;
  private _clazz: any;
}

export function New<T>(v: T): Instance<any> {
  return new Instance<T>(v);
}

export type InstanceType<T> = T | Instance<T>;

export class Closure {
  constructor(cb: Function, ctx: any, ...p: any[]) {
    this.cb = cb;
    this.ctx = ctx;
    this.argus = p;
  }

  dispose() {
    this.cb = undefined;
    this.ctx = undefined;
    this.argus = undefined;
  }

  protected cb: Function;
  protected ctx: any;
  protected argus: any[];

  // 附加数据
  payload: any;

  invoke(...p: any[]): any {
    if (this.cb) {
      return this.cb.apply(this.ctx, p ? p : this.argus);
    }
    return undefined;
  }

  reset(cb: Function, ctx: any, ...p: any[]) {
    this.cb = cb;
    this.ctx = ctx;
    this.argus = p;
  }
}

/** 拼装参数，直接发起函数调用 */
export function Invoke1(fun: Function, ctx: any, p: any[], ...prefixarguments: any[]): any {
  let argus = ArrayT.Concat(prefixarguments, p);
  return fun.apply(ctx, argus);
}

export function Invoke2(fun: Function, ctx: any, prefixarguments: any[], p: any[]): any {
  let argus = ArrayT.Concat(prefixarguments, p);
  return fun.apply(ctx, argus);
}

/** 直接运行，返回参数 */
export function call(cb: () => void) {
  return cb();
}

// 通用全局命名计数器
let _RT_NAMECOUNT = 0;

export function rtname(): string {
  return '__rt' + (_RT_NAMECOUNT++);
}
