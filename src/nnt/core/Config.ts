import {IndexedObject} from "./Kernel";

class _Config {
  [key: string]: any;

  // 默认配置
  override(cfg: IndexedObject) {
    for (let k in cfg) {
      this[k] = this._cur[k] = cfg[k];
    }
  }

  // 添加根据host判断得配置
  host(host: RegExp, cfg: IndexedObject) {
    if (!location.hostname.match(host))
      return;
    for (let k in cfg) {
      this[k] = this._cur[k] = cfg[k];
    }
  }

  url(url: RegExp, cfg: IndexedObject) {
    if (!location.href.match(url))
      return;
    for (let k in cfg) {
      this[k] = this._cur[k] = cfg[k];
    }
  }

  ua(ua: RegExp, cfg: IndexedObject) {
    if (!navigator.userAgent.toLowerCase().match(ua))
      return;
    for (let k in cfg) {
      this[k] = this._cur[k] = cfg[k];
    }
  }

  get(key: string, def?: any): any {
    return key in this._cur ? this._cur[key] : def;
  }

  set(key: string, val: any) {
    this[key] = this._cur[key] = val;
  }

  delete(key: string) {
    if (key in this._cur) {
      delete this._cur[key];
      delete this[key];
    }
  }

  private _cur: IndexedObject = {};
}

export let config = new _Config();

config.override({
  LOCAL: false,
  DEVOPS: false,
  DEVOPS_DEVELOP: false,
  DEVOPS_RELEASE: false,
  DEBUG: false,
  DEVELOP: false,
  PUBLISH: false,
  DISTRIBUTION: false,
  HOST: "<APIHOST>",
  THIRDLIBS: "static/3rd/",
  VCONSOLE: false
});

config.host(/localhost/, {
  LOCAL: true,
  DEBUG: true,
  DEVELOP: true,
  HOST: "http://localhost:8090/"
});

config.ua(/android|iphone|ipad/, {
  VCONSOLE: true
});
