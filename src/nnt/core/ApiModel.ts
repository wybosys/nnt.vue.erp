// 网络连接错误
import {
  ArrayT,
  Delay,
  drop,
  ICacheObject,
  IndexedMap,
  Interval,
  ISerializable,
  Memcache,
  ObjectT,
  SObject,
  UrlT
} from "./Kernel";
import {SignalEnd, SignalFailed, SignalStart, SignalSucceed, SignalTimeout, Slot, SlotTunnel} from "./Signals";
import {KvObject} from "./Stl";
import {CHttpConnector, HttpMethod} from "./Connector";
import {Hud} from "./Hud";
import {config} from "./Config";

export const ERROR_NETWORK_FAILED = -0xFFFFFFFE;
export const ERROR_RESPONSE_FAILED = -0xFFFFFFFD;

// todo 换到跟随配置
export const VERBOSE = !config.get('DEVOPS_RELEASE');

/* 用法
   let m = new app.model.Test();
   m.message = "hello";
   m.signals.connect(nn.Model.SignalDone, function(e:nn.Slot) {
   nn.msgbox(m.result);
   }, this);
   nn.RestSession.fetch(m);
*/

export class Model extends SObject implements ISerializable, ICacheObject {
  constructor() {
    super();
  }

  dispose() {
    this.response = undefined;
    ObjectT.Clear(this.params);
    super.dispose();
  }

  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalStart);
    this._signals.register(SignalEnd);
    this._signals.register(SignalSucceed);
    this._signals.register(SignalFailed);
    this._signals.register(SignalTimeout);
  }

  // 实现 mc 接口
  cacheFlush: boolean;
  cacheUpdated: boolean;
  cacheTime: number;

  keyForCache(): string {
    return this.host + '|' + this.action + '|' + JSON.stringify(this.paramsForCache());
  }

  paramsForCache(): KvObject<string> {
    return this.params;
  }

  valueForCache(): any {
    return this.response;
  }

  /** 动作 */
  action: string = '';

  /** 参数 */
  params = new KvObject<string>();

  /** 域 */
  host: string = '';

  /** 返回的数据 */
  response: any;

  /** 需要自动带上授权信息 */
  withCredentials: boolean = true;

  /** 由哪个session发起的请求 */
  session: SObject;

  // 为了解决跨域的问题，服务端需要收到 mcb 后，通过调用此函数回调数据
  /*
    @code php
    $res = json_encode(['code' => 0, 'data' => $message]);
    if (isset($_GET['modelcallback'])) {
    $cb = $_GET['modelcallback'];
    return "{$cb}({$res})";
    }
   */
  private _modelcallback: string;
  set modelcallback(val: string) {
    this._modelcallback = val;
    this.params['modelcallback'] = val;
  }

  get modelcallback(): string {
    return this._modelcallback;
  }

  static HTTP: string = "http://" + document.domain;
  static HTTPS: string = "https://" + document.domain;

  /** 获得请求的类型 */
  method: HttpMethod = HttpMethod.GET;

  /** 是否跨域 */
  iscross(): boolean {
    // 使用服务器转向来解决跨域的问题
    if (this.useproxy())
      return false;
    return this.host.indexOf(Model.HTTP) == -1 &&
      this.host.indexOf(Model.HTTPS) == -1;
  }

  /** 是否使用代理 */
  useproxy(): boolean {
    return false;
  }

  /** 全路径 */
  url(): string {
    return this.host + this.action;
  }

  /** 可用的参数 */
  fields(): KvObject<string> {
    return this.params;
  }

  /** 是否获取成功 */
  isSucceed(): boolean {
    return this.code === 0;
  }

  /** 保存成功或失败的状态 */
  succeed: boolean;

  /** 调试模式，即使错误也同样激活成功的消息 */
  isDebug = false;

  /** 是否显示 wait */
  showWaiting: boolean;

  /** 是否显示错误信息 */
  showError = false;

  /** 处理结果数据 */
  serialize(respn: any): boolean {
    return false;
  }

  unserialize(respn: any): boolean {
    return true;
  }

  /** 返回的数据 */
  code: number;
  message: string;

  /** 超时 s，默认不使用改特性 */
  timeout: Interval = 0;
  private _tmr_timeout: any;

  /** 超时当作失败，因为默认的超时有可能是因为这个接口本来就跑的很久，并且通常的超时提示用户也没什么意义，所以先设计为由业务层设置该功能，如果为 true，则当超时时会发送 SignalFailed */
  timeoutAsFailed: boolean;

  // 静默
  quiet: boolean;

  /** 用于调试的数据 */
  protected urlForLog(): string {
    return this.url();
  }

  protected fieldsForLog(): KvObject<string> {
    return this.fields();
  }

  // 开始拉数据
  __mdl_start() {
    // 输出日志
    if (VERBOSE) {
      let str = this.urlForLog();
      let flds = this.fieldsForLog();
      if (ObjectT.IsEmpty(flds) == false) {
        str += ' >> ' + UrlT.MapToField(flds);
      }
      console.log("API " + this.action + " 请求 " + str);
    }

    if (this.showWaiting)
      Hud.ShowProgress();

    // 启动超时计时器
    if (this.timeout)
      this._tmr_timeout = Delay(this.timeout, this.__mdl_timeout, this);

    this.signals.emit(SignalStart);
  }

  // 获取数据成功
  __mdl_completed(e: any) {
    let data = this._urlreq ? this._urlreq.data : e;

    // 判断是否需要从 json 转换回来
    if (typeof (data) == 'string') {
      try {
        this.response = JSON.parse(data);
      } catch (err) {
        this.response = {
          code: ERROR_RESPONSE_FAILED,
          message: data
        }
      }
    } else {
      this.response = data;
    }

    this.processResponse();
    this.__mdl_end();
  }

  // 获取数据失败
  __mdl_failed(e: Slot) {
    // 设置网路错误的id
    this.code = ERROR_NETWORK_FAILED;

    let tn = new SlotTunnel();
    this.signals.emit(SignalFailed, e.data, tn);
    if (!tn.veto && this.session)
      this.session.signals.emit(SignalFailed, this, tn);

    // 如果业务层阻塞掉该信号，则不转发
    if (!tn.veto && this.showError) {
      let str = VERBOSE ?
        'API ' + this.action + ' 请求服务器失败' :
        '请检查网络设置';
      Hud.Error(str);
    }

    this.__mdl_end();
  }

  __mdl_timeout() {
    if (VERBOSE)
      console.log('API ' + this.action + ' 超时');

    if (this.isDebug) {
      this.signals.emit(SignalSucceed);
      if (this.session)
        this.session.signals.emit(SignalSucceed, this);
    } else {
      if (this.timeoutAsFailed) {
        this.signals.emit(SignalFailed);
        if (this.session)
          this.session.signals.emit(SignalFailed, this);
      }

      this.signals.emit(SignalTimeout);
      if (this.session)
        this.session.signals.emit(SignalTimeout, this);
    }

    this.__mdl_end();
  }

  // 处理结束
  __mdl_end() {
    this.clear();

    this.signals.emit(SignalEnd);
    if (this.session)
      this.session.signals.emit(SignalEnd, this);

    if (this.showWaiting)
      Hud.HideProgress();

    // 调用完成，析构对象
    this.drop();
  }

  responseCode(): number {
    if ('code' in this.response)
      return this.response.code;
    else if ('1' in this.response)
      return this.response[1];
    return -1;
  }

  responseMessage(): string {
    if ('message' in this.response)
      return this.response.message;
    else if ('2' in this.response)
      return this.response[2];
    return "从服务器没有获取到数据";
  }

  // 处理接收到的数据
  processResponse() {
    this.code = this.responseCode();
    this.message = this.responseMessage();

    if (VERBOSE)
      console.log('API ' + this.action + ' 返回 ' + JSON.stringify(this.response));

    this.cacheUpdated = false;
    if ((this.succeed = this.isSucceed())) {
      if (VERBOSE)
        console.log('API ' + this.action + ' 请求成功');

      if (this.cacheTime && this.cacheFlush) {
        this.cacheUpdated = true;
        // 添加到缓存中
        Memcache.shared.cache(this);
      }

      this.unserialize(this.response);
      if (!this.quiet) {
        this.signals.emit(SignalSucceed, this);
        if (this.session)
          this.session.signals.emit(SignalSucceed, this);
      }
    } else {
      console.error('API ' + this.action + ' ' + this.message);

      let tn = new SlotTunnel();
      if (this.isDebug) {
        if (!this.quiet) {
          this.signals.emit(SignalSucceed, this);
          if (this.session)
            this.session.signals.emit(SignalSucceed, this);
        }
      } else {
        this.signals.emit(SignalFailed, this, tn);
        if (!tn.veto && this.session)
          this.session.signals.emit(SignalFailed, this, tn);
      }

      // 业务层可以拦截处理
      if (!tn.veto && this.showError && this.message)
        Hud.Error(this.message);
    }
  }

  protected clear() {
    // 释放连接
    this._urlreq = drop(this._urlreq);
    this._urlreq = undefined;

    // 释放超时判定
    if (this._tmr_timeout) {
      this._tmr_timeout.stop();
      this._tmr_timeout = undefined;
    }

    this.session = null;
  }

  _urlreq: CHttpConnector;

  /** 调用的时间 */
  ts: number;
}

/** 支持分页的model */
export class PagedModel<ItemT> {
  constructor() {
  }

  // 添加页数据
  add(page: any, items: Array<ItemT>) {
    this.changed = false;
    if (this._items.contains(page))
      return;
    // 如果items为空，则也不加入，为了下一次同页面刷新
    if (items.length == 0)
      return;
    this.changed = true;
    this._items.add(page, items);
    this.page = page;
  }

  // 是否页面数据发生改变
  changed: boolean;

  // 当前页的标记
  page: any = 0;

  // 所有分页的数据
  private _items = new IndexedMap<any, Array<ItemT>>();

  // 获得当前页面的items
  get items(): Array<ItemT> {
    return this._items.objectForKey(this.page);
  }

  // 所有页面的对象
  get allItems(): ItemT[] {
    let r: ItemT[] = [];
    this._items.forEach((k: any, o: ItemT[]) => {
      ArrayT.PushObjects(r, o);
    });
    return r;
  }

  // 前一页面
  previous(): boolean {
    let idx = this._items.indexOfKey(this.page);
    if (idx == 0)
      return false;
    this.page = this._items.keyForIndex(idx - 1);
    return true;
  }

  // 后一页，如果返回false，则需要去查询有没有后一页
  next(): boolean {
    let idx = this._items.indexOfKey(this.page);
    let k = this._items.keyForIndex(idx + 1);
    if (k == null)
      return false;
    this.page = k;
    return true;
  }
}
