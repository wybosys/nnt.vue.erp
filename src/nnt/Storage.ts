import {asString, ICodec, IndexedObject, IShared} from "./Kernel";
import {Closure} from "./Typescript";

export let IMP_STORAGE_GET: (key: string) => string;
export let IMP_STORAGE_SET: (key: string, v: string) => void;
export let IMP_STORAGE_DEL: (key: string) => void;
export let IMP_STORAGE_CLEAR: () => void;

export class Storage implements IShared {
  // 编解码器
  codec: ICodec;

  // key的前缀
  private _prefix: string = '::n2';
  get prefix(): string {
    return this._prefix;
  }

  set prefix(pre: string) {
    this._prefix = pre ? pre : '';
  }

  // domain组，业务通常设置为userId
  domain: any;

  // 获取真正的key，避免同一个domain下key冲突
  protected getKey(key: string): string {
    let s = this.prefix;
    if (this.domain)
      s += "::" + this.domain;
    s += key;
    return s;
  }

  // 设置数据
  set(key: string, val: any) {
    if (key == null)
      return;
    let ks = this.getKey(key);
    if (this.codec)
      ks = this.codec.encode(ks);
    if (val == null) {
      IMP_STORAGE_DEL(ks);
    } else {
      let vs = val.toString();
      if (this.codec)
        vs = this.codec.encode(vs);
      IMP_STORAGE_SET(ks, vs);
    }
  }

  // 读取数据
  value(key: string, def?: string | Closure): string {
    let ks = this.getKey(key);
    if (this.codec)
      ks = this.codec.encode(ks);
    let vs = IMP_STORAGE_GET(ks);
    if (this.codec && vs)
      vs = this.codec.decode(vs);
    if (vs == null) {
      if (<any>def instanceof Closure)
        vs = (<Closure>def).invoke();
      else
        vs = asString(def, null);
    }
    return vs;
  }

  // 快速设置一些数值
  setBool(key: any, val: boolean) {
    this.set(key, val ? '1' : '0');
  }

  getBool(key: any, def?: boolean): boolean {
    let r = this.value(key, def ? '1' : '0');
    return r != '0';
  }

  setNumber(key: any, val: number) {
    this.set(key, val);
  }

  getNumber(key: any, def?: number): number {
    let r = this.value(key, def ? def.toString() : '0');
    return parseFloat(r);
  }

  setObject(key: any, val: Object) {
    this.set(key, JSON.stringify(val));
  }

  getObject(key: any): any {
    let s = this.value(key);
    return JSON.parse(s);
  }

  clear() {
    IMP_STORAGE_CLEAR();
  }

  static shared = new Storage();
}

// 需要判断一下是使用LocalStorage还是使用SessionStorage
let _storageMode = ((): number => {
  let key = "::n2::test::localstorage::mode";
  localStorage.setItem(key, "test");
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    return 0;
  }
  if (window && window.sessionStorage) {
    try {
      window.sessionStorage.setItem(key, "test");
      window.sessionStorage.removeItem(key);
      return 1;
    } catch (e) {
    } // 不支持sessionStorage
  }
  return -1;
})();

if (_storageMode == 0) {
  IMP_STORAGE_GET = k => localStorage.getItem(k)
  IMP_STORAGE_SET = (k, v) => localStorage.setItem(k, v)
  IMP_STORAGE_DEL = k => localStorage.removeItem(k)
  IMP_STORAGE_CLEAR = () => localStorage.clear()
} else if (_storageMode == 1) {
  IMP_STORAGE_GET = k => window.sessionStorage.getItem(k)
  IMP_STORAGE_SET = (k, v) => window.sessionStorage.setItem(k, v)
  IMP_STORAGE_DEL = k => window.sessionStorage.removeItem(k)
  IMP_STORAGE_CLEAR = () => window.sessionStorage.clear()
} else {
  let __g_storage: IndexedObject = {}
  IMP_STORAGE_GET = k => __g_storage[k]
  IMP_STORAGE_SET = (k, v) => __g_storage[k] = v
  IMP_STORAGE_DEL = k => delete __g_storage[k]
  IMP_STORAGE_CLEAR = () => __g_storage = {}
}
