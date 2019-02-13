import {Model, VERBOSE} from "./ApiModel";
import {DateTime, ISObject, Memcache, SObject} from "./Kernel";
import {SignalDone, SignalEnd, SignalFailed, SignalStart, SignalSucceed, SignalTimeout, Slot} from "./Signals";
import {HttpConnector, HttpMethod} from "./Connector";
import {config} from "./Config";

export class _CrossLoader {
  private static _regID: number = 0;
  static completeCall: any = {};

  static process(m: Model) {
    _CrossLoader.completeCall["call_" + _CrossLoader._regID] = (data: any) => {
      let id = _CrossLoader._regID;
      m.__mdl_completed(data);
      delete _CrossLoader.completeCall["call_" + id];
    };

    _CrossLoader.start(m, _CrossLoader._regID++);
  }

  private static start(m: Model, id: number): void {
    let script = document.createElement('script');
    m.modelcallback = "nn._CrossLoader.completeCall.call_" + id + "";
    script.src = m.url();
    document.body.appendChild(script);
  }
}

export interface IRestSession extends ISObject {
  SID: string;

  post(m: Model, cb?: (s?: Slot) => void, cbctx?: any): void;

  fetch(m: Model,
        cbsuc?: (s?: Slot) => void, cbctx?: any,
        cbfail?: (s?: Slot) => void, cbend?: () => void): void;

  fetchs(ms: Array<Model>,
         cbsuc?: (ss?: Array<Slot>) => void, cbctx?: any): void;
}

class _RestSession extends SObject {
  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalStart);
    this._signals.register(SignalSucceed);
    this._signals.register(SignalFailed);
    this._signals.register(SignalEnd);
    this._signals.register(SignalTimeout);
  }

  /** 可选的SESSIONID，将附带到URL的尾端 */
  SID: string;

  // 请求API的序列号
  static __sequenceId = 0;

  post(m: Model, cb?: (s?: Slot) => void, cbctx?: any) {
    m.showWaiting = false;
    m.showError = false;
    this.fetch(m, cb, cbctx);
  }

  /** 获取一个数据
   @param cb, 成功后的回调
   @param cbfail, 失败后的回调
   @param cbend, 结束的回调（不区分成功、失败）
   */
  fetch(m: Model,
        cbsuc?: (s?: Slot) => void, cbctx?: any,
        cbfail?: (s?: Slot) => void, cbend?: () => void) {
    m.ts = DateTime.Now();

    // 为了防止正在调用 api 时，接受信号的对象析构，保护一下
    if (cbctx)
      m.attach(cbctx);

    if (cbsuc)
      m.signals.connect(SignalSucceed, cbsuc, cbctx);
    if (cbfail)
      m.signals.connect(SignalFailed, cbfail, cbctx);
    if (cbend)
      m.signals.connect(SignalEnd, cbend, cbctx);

    // 判断是否支持缓存
    if (m.cacheTime && !m.cacheFlush) {
      // 先去查找一下原来的数据
      let respn = Memcache.shared.query(m.keyForCache());
      if (respn) {
        if (VERBOSE)
          console.log("成功获取到缓存数据");

        // 手动激活一下请求开始
        m.__mdl_start();

        // 存在可用的缓存，则直接 parse
        m.response = respn;
        m.processResponse();

        // 处理结束
        m.__mdl_end();
        return;
      }
    }

    // 如果不支持缓存，则为了兼容获取时对数据新旧的判断，设置为强刷
    m.cacheFlush = true;

    // 初始化网络
    m._urlreq = new HttpConnector();
    if (m.withCredentials)
      m._urlreq.useCredentials();
    m._urlreq.signals.connect(SignalDone, m.__mdl_completed, m);
    m._urlreq.signals.connect(SignalFailed, m.__mdl_failed, m);
    m.__mdl_start();

    if (m.iscross()) {
      _CrossLoader.process(m);
    }
    else {
      let url = m.url();

      if (url.indexOf('?') == -1)
        url += '?';
      else
        url += '&';

      // _ts_ 时间戳用来防止浏览器缓存API调用
      url += '_ts_=' + m.ts;

      // 增加sessionid以解决cookie不稳定导致的问题
      if (this.SID)
        url += '&_sid=' + this.SID;

      // devops
      if (!config.get('DEVOPS_RELEASE'))
        url += '&_skippermission=1';

      m._urlreq.url = url;
      m._urlreq.method = m.method;
      m._urlreq.fields = m.fields();
      m._urlreq.start();
    }
  }

  /** 批量调用一堆接口，返回和调用的顺序保持一致 */
  fetchs(ms: Array<Model>,
         cbsuc?: (ss?: Array<Slot>) => void, cbctx?: any) {
    let ss: any[] = [];
    let work = (ms: Array<Model>, idx: number) => {
      if (idx == ms.length) {
        cbsuc.call(cbctx, ss);
        return;
      }
      this.fetch(ms[idx++], (s) => {
        ss.push(s);
        // 下一个
        work(ms, idx);
      }, null);
    };
    work(ms, 0);
  }
}

export var RestSession: IRestSession = new _RestSession();

export function Get<T>(m: T): Promise<T> {
  return new Promise<T>(resolve => {
    RestSession.fetch(<any>m, () => {
      resolve(m);
    }, null, () => {
      resolve(null);
    });
  });
}

export function Fetch<T>(m: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    RestSession.fetch(<any>m, () => {
      resolve(m);
    }, null, err => {
      reject(new Error());
    });
  });
}
