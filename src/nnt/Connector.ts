import {Failed, SObject, UrlT} from "./Kernel";
import {
  SignalChanged,
  SignalClose,
  SignalDataChanged,
  SignalDone,
  SignalEnd,
  SignalFailed,
  SignalOpen, SignalTimeout
} from "./Signals";
import {KvObject} from "./Stl";
import {Media} from "./Media";

export enum HttpMethod {
  GET,
  POST,
}

/** http连接器 */
export class CHttpConnector extends SObject {
  dispose() {
    super.dispose();
    this.data = undefined;
    this.fields = undefined;
  }

  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalEnd);
    this._signals.register(SignalDone);
    this._signals.register(SignalFailed);
    this._signals.register(SignalChanged);
  }

  /** 请求方式 */
  method = HttpMethod.GET;

  /** 全url */
  url: string;

  /** fields */
  fields: KvObject<any>;

  /** 获取的数据 */
  data: any;

  /** override 发送请求 */
  start() {
  }

  /** override 使用自动授权 */
  useCredentials() {
  }

  fullUrl(fields?: KvObject<any>): string {
    let r = this.url;
    if (!fields)
      fields = this.fields;
    if (fields) {
      if (r.indexOf('?') == -1)
        r += '?';
      else
        r += '&';
      r += UrlT.MapToField(fields);
    }
    return r;
  }
}

/** socket连接器 */
export abstract class CSocketConnector extends SObject {
  /** 地址 */
  host: string;

  protected _initSignals() {
    super._initSignals();
    this._signals.register(SignalOpen);
    this._signals.register(SignalClose);
    this._signals.register(SignalDataChanged);
    this._signals.register(SignalTimeout);
    this._signals.register(SignalFailed);
  }

  /** 是否已经打开 */
  abstract isopened(): boolean;

  /** 连接服务器 */
  abstract open(): void;

  /** 断开连接 */
  abstract close(): void;

  /** 发送对象 */
  abstract write(obj: any): void;

  /** 监听对象 */
  abstract watch(obj: any, on: boolean): void;
}

// network
export class HttpConnector extends CHttpConnector {
  constructor() {
    super();
    this._imp.onreadystatechange = ev => {
      this._cb_readystate(ev);
    };
    this._imp.onerror = (ev: ProgressEvent) => {
      this._cb_error(ev);
    };
  }

  dispose() {
    super.dispose();
    this._imp = undefined;
  }

  private _imp = new XMLHttpRequest();

  start() {
    this.data = null;

    // 判断有没有上传文件
    let hasfile = false;
    if (this.fields) {
      for (let k in this.fields) {
        let v = this.fields[k];
        if (v instanceof File) {
          hasfile = true;
          break;
        }
        if (v instanceof Media) {
          hasfile = true;
          break;
        }
      }
      // 有文件必须走post
      if (hasfile)
        this.method = HttpMethod.POST;
    }

    if (this.method == HttpMethod.GET) {
      this._imp.open('GET', this.fullUrl());
      this._imp.send();
    }
    else {
      this._imp.open('POST', this.url);
      if (hasfile) {
        let form = new FormData();
        for (let k in this.fields) {
          let v = this.fields[k];
          if (v instanceof Media)
            v = v.save();
          form.append(k, v);
        }
        this._imp.send(form);
      } else {
        let d = UrlT.MapToField(this.fields);
        this._imp.send(d);
      }
    }
  }

  useCredentials() {
    this._imp.withCredentials = true;
  }

  private _cb_readystate(ev: Event) {
    switch (this._imp.readyState) {
      case XMLHttpRequest.DONE: {
        this.data = this._imp ? this._imp.response : null;
        this.signals.emit(SignalDone, this.data);
        this.signals.emit(SignalEnd);
      }
        break;
    }
  }

  private _cb_error(ev: ProgressEvent) {
    this.signals.emit(SignalFailed, new Failed(-1, "网络连接失败"));
    this.signals.emit(SignalEnd);
  }
}
