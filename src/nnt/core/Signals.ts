import {CSet, KvObject} from "./Stl";
import {ArrayT} from "./ArrayT";
import {ObjectT} from "./ObjectT";
import {SetT} from "./SetT";

// 用于穿透整个emit流程的对象
export class SlotTunnel {
  /** 是否请求中断了emit过程 */
  veto: boolean;

  /** 附加数据 */
  payload: any;
}

// 插槽对象
export class Slot {
  /** 重定向的信号 */
  redirect: string;

  /** 回调 */
  cb: (e: Slot) => void;

  /** 回调的上下文 */
  target: any;

  /** 激发者 */
  sender: any;

  /** 数据 */
  data: any;

  /** 延迟s启动 */
  delay: number;

  /** 穿透用的数据 */
  tunnel: SlotTunnel;

  /** connect 时附加的数据 */
  payload: any;

  /** 信号源 */
  signal: string;

  /** 激发频率限制 (emits per second) */
  eps: number = 0;
  private _epstms: number;

  /** 是否中断掉信号调用树 */
  private _veto: boolean;
  get veto(): boolean {
    return this._veto;
  }

  set veto(b: boolean) {
    this._veto = b;
    if (this.tunnel)
      this.tunnel.veto = b;
  }

  /** 调用几次自动解绑，默认为 null，不使用概设定 */
  count: number;
  emitedCount: number = 0;

  dispose() {
    this.cb = null;
    this.target = null;
    this.sender = null;
    this.data = null;
    this.payload = null;
    this.tunnel = null;
  }

  /** 激发信号
   @data 附带的数据，激发后自动解除引用 */
  emit(data: any, tunnel: SlotTunnel) {
    if (this.eps) {
      let now = new Date().getTime();
      if (this._epstms == undefined) {
        this._epstms = now;
      } else {
        let el = now - this._epstms;
        //this._epstms = now; 注释以支持快速多次点击中可以按照频率命中一次，而不是全部都忽略掉
        if ((1000 / el) > this.eps)
          return;
        this._epstms = now;//命中一次后重置时间
      }
    }

    this.data = data;
    this.tunnel = tunnel;

    if (this.delay) {
      setTimeout(() => {
        this.doEmit();
      }, this.delay * 1000);
    } else {
      this.doEmit();
    }
  }

  protected doEmit() {
    if (this.target) {
      if (this.cb) {
        this.cb.call(this.target, this);
      } else if (this.redirect && this.target.signals) {
        this.target.signals.emit(this.redirect, this.data);
      }
    } else if (this.cb) {
      this.cb.call(this, this);
    }

    this.data = undefined;
    this.tunnel = undefined;

    ++this.emitedCount;
  }

  static Data(d: any): Slot {
    let r = new Slot();
    r.data = d;
    return r;
  }
}

export class Slots {

  // 保存所有插槽
  slots = new Array<Slot>();

  // 所有者，会传递到 Slot 的 sender
  owner: any;

  // 信号源
  signal: string;

  dispose() {
    this.clear();
    this.owner = undefined;
  }

  /** 清空连接 */
  clear() {
    ArrayT.Clear(this.slots, (o: Slot) => {
      o.dispose();
    });
  }

  toString(): string {
    let str = "";
    this.slots.forEach((e, i) => {
      str += "\tslot" + i + ": " + e + "\n";
    }, this);
    return str;
  }

  /** 阻塞信号
   @note emit被阻塞的信号将不会有任何作用
   */
  private _block: number = 0;

  block() {
    this._block += 1;
  }

  unblock() {
    this._block -= 1;
  }

  /** 是否已经阻塞 */
  isblocked(): boolean {
    return this._block != 0;
  }

  /** 添加一个插槽 */
  add(s: Slot) {
    this.slots.push(s);
  }

  /** 对所有插槽激发信号
   @note 返回被移除的插槽的对象
   */
  emit(data: any, tunnel: SlotTunnel): CSet<any> {
    if (this.isblocked())
      return null;

    let ids: Array<number>;
    ArrayT.SafeForeach(this.slots, (o: Slot, idx: number): boolean => {
      if (o.count != null &&
        o.emitedCount >= o.count)
        return true; // 激活数控制

      // 激发信号
      o.signal = this.signal;
      o.sender = this.owner;
      o.emit(data, tunnel);

      // 控制激活数
      if (o.count != null &&
        o.emitedCount >= o.count) {
        if (ids == null)
          ids = new Array<number>();
        ids.push(idx);
        return true;
      }

      return !(o.veto);
    }, this);

    // 删除用完的slot
    if (ids) {
      let r = new CSet<any>();
      ArrayT.RemoveObjectsInIndexArray(this.slots, ids)
        .forEach((o: Slot): boolean => {
          if (o.target)
            r.add(o.target);
          // 释放
          o.dispose();
          return true;
        });
      return r;
    }

    return null;
  }

  disconnect(cb: (e: Slot) => void, target: any): boolean {
    let rmd = ArrayT.RemoveObjectsByFilter(this.slots, (o: Slot) => {
      if (cb && o.cb != cb)
        return false;
      if (o.target == target) {
        o.dispose();
        return true;
      }
      return false;
    }, this);
    return rmd.length != 0;
  }

  find_connected_function(cb: (e: Slot) => void, target: any): Slot {
    return ArrayT.QueryObject(this.slots, (s: Slot): boolean => {
      return s.cb == cb && s.target == target;
    });
  }

  find_redirected(sig: string, target: any): Slot {
    return ArrayT.QueryObject(this.slots, (s: Slot): boolean => {
      return s.redirect == sig && s.target == target;
    }, this);
  }

  is_connected(target: any): boolean {
    return ArrayT.QueryObject(this.slots, (s: Slot): boolean => {
      return s.target == target;
    }, this) != null;
  }
}

export interface SignalsDelegate {
  _signalConnected(sig: string, s?: Slot): void;
}

export class Signals {
  constructor(owner: any) {
    this.owner = owner;
  }

  private _slots = new KvObject<Slots>();

  // 信号的主体
  owner: any;

  // 监听信号
  delegate: SignalsDelegate;

  // 析构
  dispose() {
    // 反向断开连接
    SetT.Clear(this.__invtargets, (o: any) => {
      if (o.owner && o.owner._signals)
        o.owner._signals.disconnectOfTarget(this.owner, false);
    }, this);

    // 清理信号，不能直接用clear的原因是clear不会断开对于ower的引用
    ObjectT.Clear(this._slots, (k: string, o: Slots) => {
      if (o)
        o.dispose();
    });

    this.owner = null;
    this.delegate = null;
    this._castings = null;
  }

  clear() {
    // 清空反向的连接
    SetT.Clear(this.__invtargets, (o: any) => {
      if (o.owner && o.owner._signals)
        o.owner._signals.disconnectOfTarget(this.owner, false);
    }, this);

    // 清空slot的连接
    ObjectT.Foreach(this._slots, (k: string, o: Slots) => {
      if (o)
        o.clear();
    });
  }

  toString(): string {
    let str = "";
    ObjectT.Foreach(this._slots, (k, v) => {
      str += k + ": " + v + "\n";
    }, this);
    return str;
  }

  /** 注册信号 */
  register(sig: string) {
    if (sig == null) {
      console.error("不能注册一个空信号");
      return;
    }

    if (this._slots[sig])
      return;

    this._slots[sig] = null;
  }

  protected avaslots(sig: string): Slots {
    let ss = this._slots[sig];
    if (ss === undefined) {
      console.error("对象 " + this.owner + " 信号 " + sig + " 不存在");
      return null;
    }
    if (ss == null) {
      ss = new Slots();
      ss.signal = sig;
      ss.owner = this.owner;
      this._slots[sig] = ss;
    }
    return ss;
  }

  /** 只连接一次 */
  once(sig: string, cb: (...p: any[]) => void, target: any): Slot {
    let r = this.connect(sig, cb, target);
    r.count = 1;
    return r;
  }

  /** 连接信号插槽 */
  connect(sig: string, cb: (...p: any[]) => void, target: any): Slot {
    let ss = this.avaslots(sig);
    if (ss == null) {
      console.error("对象 " + this.owner + " 信号 " + sig + " 不存在");
      return null;
    }

    let s: Slot;
    if (s = ss.find_connected_function(cb, target))
      return s;

    s = new Slot();
    s.cb = cb;
    s.target = target;
    ss.add(s);

    if (this.delegate)
      this.delegate._signalConnected(sig, s);

    this.__inv_connect(target);

    return s;
  }

  /** 该信号是否存在连接上的插槽 */
  isConnected(sig: string): boolean {
    let ss = this._slots[sig];
    return ss != null && ss.slots.length != 0;
  }

  /** 转发一个信号到另一个对象的信号 */
  redirect(sig: string, sig2: string, target: any): Slot;
  redirect(sig: string, target: any): Slot;
  redirect(...params: any[]): Slot {
    let sig, sig2, target;
    sig = params[0];
    if (params.length == 3) {
      sig2 = params[1];
      target = params[2];
    } else if (params.length == 2) {
      if (typeof (params[1]) == 'string') {
        sig2 = params[1];
        target = this.owner;
      } else {
        sig2 = sig;
        target = params[1];
      }
    } else {
      console.error("SignalRedirect 传入了错误的参数");
      return;
    }

    let ss = this.avaslots(sig);

    let s: Slot;
    if (s = ss.find_redirected(sig2, target))
      return s;

    s = new Slot();
    s.redirect = sig2;
    s.target = target;
    ss.add(s);

    if (this.delegate)
      this.delegate._signalConnected(sig, s);

    this.__inv_connect(target);

    return s;
  }

  /** 激发信号 */
  emit(sig: string, data?: any, tunnel?: SlotTunnel) {
    let ss = this._slots[sig];
    if (ss) {
      let targets = ss.emit(data, tunnel);
      if (targets) {
        // 收集所有被移除的target，并断开反向连接
        targets.forEach((target: any) => {
          if (this.isConnectedOfTarget(target) == false)
            this.__inv_disconnect(target);
        }, this);
      }
    } else if (ss === undefined) {
      console.error("对象 " + this.owner + " 信号 " + sig + " 不存在");
      return;
    }
  }

  /** 向外抛出信号
   @note 为了解决诸如金币变更、元宝变更等大部分同时发生的事件但是因为set的时候不能把这些的修改函数合并成1个函数处理，造成同一个消息短时间多次激活，所以使用该函数可以在下一帧开始后归并发出唯一的事件。所以该函数出了信号外不支持其他带参
   */
  cast(sig: string) {
    if (this._castings == null) {
      this._castings = new CSet<string>();
      setTimeout(() => {
        this._doCastings();
      }, 0);
    }
    this._castings.add(sig);
  }

  private _castings: CSet<string>;

  private _doCastings() {
    if (this._castings == null)
      return;
    this._castings.forEach((sig: string) => {
      this.emit(sig);
    });
    this._castings = null;
  }

  /** 断开连接 */
  disconnectOfTarget(target: any, inv = true) {
    if (target == null)
      return;

    ObjectT.Foreach(this._slots, (sig: string, ss: Slots) => {
      if (ss)
        ss.disconnect(null, target);
    }, this);

    if (inv)
      this.__inv_disconnect(target);
  }

  /** 断开连接 */
  disconnect(sig: string, cb?: (e: Slot) => void, target?: any) {
    let ss = this._slots[sig];
    if (ss == null)
      return;

    if (cb == null && target == null) {
      // 清除sig的所有插槽，自动断开反向引用
      let targets = new CSet<any>();
      ArrayT.Clear(ss.slots, (o: Slot) => {
        if (o.target)
          targets.add(o.target);
        o.dispose();
      });
      targets.forEach((target: any) => {
        if (!this.isConnectedOfTarget(target))
          this.__inv_disconnect(target);
      }, this);
    } else {
      // 先清除对应的slot，再判断是否存在和target相连的插槽，如过不存在，则断开反向连接
      if (ss.disconnect(cb, target) &&
        target && !this.isConnectedOfTarget(target)) {
        this.__inv_disconnect(target);
      }
    }
  }

  isConnectedOfTarget(target: any): boolean {
    return ObjectT.QueryObject(this._slots, (sig: string, ss: Slots): boolean => {
      return ss ? ss.is_connected(target) : false;
    }, this) != null;
  }

  /** 阻塞一个信号，将不响应激发 */
  block(sig: string) {
    let ss = this._slots[sig];
    ss && ss.block();
  }

  unblock(sig: string) {
    let ss = this._slots[sig];
    ss && ss.unblock();
  }

  isblocked(sig: string): boolean {
    let ss = this._slots[sig];
    if (ss)
      return ss.isblocked();
    return false;
  }

  // 反向登记，当自身 dispose 时，需要和对方断开
  private __invtargets = new CSet<Signals>();

  private __inv_connect(tgt: any) {
    if (tgt == null || tgt.signals == null)
      return;
    if (tgt.signals == this)
      return;
    tgt.signals.__invtargets.add(this);
  }

  private __inv_disconnect(tgt: any) {
    if (tgt == null || tgt.signals == null)
      return;
    if (tgt.signals == this)
      return;
    tgt.signals.__invtargets.delete(this);
  }
}

// 遇到了一个异常
export const SignalException = "::nn::exception";

// 动作完成，通常代表成功后的完成
export const SignalDone = "::nn::done";

// 成功
export const SignalSucceed = "::nn::done";
export const SignalOk = "::nn::done";

// 超时
export const SignalTimeout = "::nn::timeout";

// 动作结束，和完成概念不一样，代表一个阶段的结束
export const SignalEnd = "::nn::end";

// 动作开始
export const SignalStart = "::nn::start";

// 动作退出
export const SignalExit = "::nn::exit";

// 改变已经发生(改变只有设置不同的数据时发生)
export const SignalChanged = "::nn::changed";

// 发生更新(跟新和改变的区别为，更新可以为重复设置相同的数据)
export const SignalUpdated = "::nn::update::need";

// 暂停
export const SignalPaused = "::nn::paused";

// 恢复
export const SignalResume = "::nn::resume";

// 数据发生改变
export const SignalDataChanged = "::nn::data::changed";

// 项目发生改变
export const SignalItemChanged = "::nn::item::changed";

// 取消
export const SignalCancel = "::nn::cancel";

// 失败
export const SignalFailed = "::nn::failed";

// 正在添加，位于 added 之前激发
export const SignalAdding = "::nn::adding";

// 已经添加
export const SignalAdded = "::nn::added";

// 正在移除，位于 remove 之前激发
export const SignalRemoving = "::nn::removing";

// 已经移除
export const SignalRemoved = "::nn::removed";

// 显示状态变更
export const SignalVisibleChanged = "::nn::visible::changed";

// 需要重新动作一下
export const SignalNeedRedo = "::nn::redo::need";

// 需要刷新
export const SignalNeedReload = "::nn::reload::need";

// 需要强制刷新
export const SignalNeedFlush = "::nn::flush::need";

// 新的项目发生
export const SignalNewChanged = "::nn::new::changed";

// 请求一个动作，例如计时器到时
export const SignalAction = "::nn::action";

// 选择产生了变化
export const SignalSelected = "::nn::selection::on";
export const SignalDeselected = "::nn::selection::off";

// 选中的变化，一般data会带上 {old, now} 两个数据
export interface SelectionData {
  old: any;
  now: any;
};
export const SignalSelectionChanged = "::nn::selection::changed";
export const SignalSelectionChanging = "::nn::selection::changing";

// 加载成功
export const SignalLoaded = "::nn::loaded";

// 激活
export const SignalActivated = "::nn::activated";
export const SignalDeactivated = "::nn::deactivated";

// 聚焦
export const SignalFocusGot = "::nn::focus::got";
export const SignalFocusLost = "::nn::focus::lost";

// 约束条件发生了变化，例如 ui 的内容产生了需要改变 ui 尺寸的动作
export const SignalConstriantChanged = "::nn::constriant::changed";

// 点击
export const SignalClicked = "::nn::clicked";

// 元素点击
export const SignalItemClicked = "::nn::item::clicked";

// 触摸相关
export const SignalTouchBegin = "::nn::touch::begin"; // 开始
export const SignalTouchEnd = "::nn::touch::end"; // 结束
export const SignalTouchMove = "::nn::touch::move"; // 移动

// 按键相关
export const SignalKeyPress = "::nn::key::press"; // 任意键
export const SignalEnterKey = "::nn::key::enter"; // 回车键

// 滚动相关
export const SignalScrollBegin = "::nn::scroll::begin";
export const SignalScrollEnd = "::nn::scroll::end";
export const SignalScrolled = "::nn::scroll::changed";

// 请求一次 hitTest 的判定
export const SignalHitTest = "::nn::hittest";

// 尺寸的改变
export const SignalFrameChanged = "::nn::frame::changed";

// 状态的改变
export const SignalStateChanged = "::nn::state::changed";

// 朝向变化
export const SignalOrientationChanged = "::nn::orientation::changed";

// 打开
export const SignalOpening = "::nn::opening";
export const SignalOpen = "::nn::open";
export const SignalConnected = "::nn::connected";

// 关闭
export const SignalClosing = "::nn::Closing";
export const SignalClose = "::nn::close";
