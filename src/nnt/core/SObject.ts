import {drop, IRefObject, ISObject} from "./Kernel";
import {Signals} from "./Signals";
import {ArrayT} from "./ArrayT";

/** 带有信号的基类
 @brief 如果不能直接基类，需要实现信号的相关函数 */
export class SObject implements IRefObject, ISObject {
  /** 构造函数 */
  constructor() {
  }

  tag: any;

  /** 唯一id */
  static HashCode = 0;
  hashCode: number = ++SObject.HashCode;

  // 已经析构掉，用来 debug 模式下防止多次析构
  __disposed = false;

  /** 析构函数 */
  dispose() {
    if (this.__disposed) {
      console.warn("对象 " + this + " 已经析构");
    }
    this.__disposed = true;

    if (this._attachs) {
      ArrayT.Clear(this._attachs, (o: any) => {
        drop(o);
      });
    }

    if (this._signals) {
      this._signals.dispose();
      this._signals = undefined;
    }
  }

  /** 实现注册信号
   @note 业务通过重载此函数并通过调用 this._signals.register 来注册信号
   */
  protected _initSignals() {
  }

  /** 信号 */
  protected _signals: Signals;
  get signals(): Signals {
    if (this._signals)
      return this._signals;
    this._instanceSignals();
    return this._signals;
  }

  protected _instanceSignals() {
    this._signals = new Signals(this);
    this._initSignals();
  }

  /** 绑定一个生命期 */
  private _attachs: Array<any>;

  attach(o: any) {
    // 如果不存在生命期维护，则直接放弃
    if (o.grab == undefined)
      return;
    if (this._attachs == null)
      this._attachs = new Array<any>();
    o.grab();
    this._attachs.push(o);
  }

  detach(o: any) {
    if (o.drop == undefined)
      return;
    if (this._attachs == null)
      return;
    o.drop();
    ArrayT.RemoveObject(this._attachs, o);
  }

  /** 维护一个内部的引用计数器，防止对象的提前析构 */
  protected _refcnt = 1;

  /** 释放一次引用，如果到0则析构对象 */
  drop() {
    if (this.__disposed) {
      console.warn("对象 " + this + " 已经析构");
    }

    if (--this._refcnt == 0)
      this.dispose();
  }

  /** 增加一次引用 */
  grab() {
    ++this._refcnt;
  }

  /** 调用自己 */
  callself<implT>(cb: (s: implT) => void, ctx?: any): implT {
    cb.call(ctx ? ctx : this, this);
    return <any>this;
  }

  /** 获得自己，为了支持 InstanceType */
  get obj(): this {
    return this;
  }

  /** 测试自己是否为空 */
  isnull(): boolean {
    if (this.__disposed)
      return true;
    return false;
  }

  /** 比较函数 */
  isEqual(r: this): boolean {
    return this == r;
  }
}
