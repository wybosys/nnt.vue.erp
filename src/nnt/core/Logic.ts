import {
  ArrayT,
  asString,
  DateTime,
  Delay,
  IndexedObject,
  IntFloat,
  MapT,
  MultiMap,
  StringT,
  toDouble,
  toInt,
  toJsonObject,
  toNumber
} from "./Kernel";
import { KvObject } from "./Stl";
import { Model } from "./ApiModel";
import { WebSocketConnector } from "./SocketSession";
import { Application } from "./Application";

type Class<T> = { new(...args: any[]): T, [key: string]: any };
type AnyClass = Class<any>;
type clazz_type = AnyClass | string;

export interface FieldOption {
  // 唯一序号，后续类似pb的协议会使用id来做数据版本兼容
  id: number;

  // 默认值
  val?: any;

  // 可选
  optional: boolean;

  // 读取控制
  input: boolean;
  output: boolean;

  // 类型标签
  array?: boolean;
  map?: boolean;
  multimap?: boolean;
  string?: boolean;
  integer?: boolean;
  double?: boolean;
  number?: boolean;
  boolean?: boolean;
  enum?: boolean;
  file?: boolean;
  json?: boolean;
  filter?: boolean;
  intfloat?: number;

  // 注释
  comment?: string;

  // 关联类型
  keytype?: clazz_type;
  valtype?: clazz_type;
}

const FP_KEY = "__fieldproto";

function CloneFps(fps: IndexedObject): IndexedObject {
  let r: IndexedObject = {};
  for (let k in fps) {
    r[k] = LightClone(fps[k]);
  }
  return r;
}

function LightClone(tgt: any): any {
  let r: IndexedObject = {};
  for (let k in tgt) {
    r[k] = tgt[k];
  }
  return r;
}

function DefineFp(target: any, key: string, fp: FieldOption) {
  let fps: IndexedObject;
  if (target.hasOwnProperty(FP_KEY)) {
    fps = target[FP_KEY];
  } else {
    if (FP_KEY in target) {
      fps = CloneFps(target[FP_KEY]);
      for (let k in fps) {
        let fp: FieldOption = fps[k];
        fp.id *= 100;
      }
    } else {
      fps = {};
    }
    Object.defineProperty(target, FP_KEY, {
      enumerable: false,
      get: () => {
        return fps;
      }
    });
  }
  fps[key] = fp;
  Object.defineProperty(target, key, {
    value: fp.val,
    writable: true
  });
  // 生成get/set方法，便于客户端连写
  let proto = target.constructor.prototype;
  let nm = StringT.UpcaseFirst(key);
  proto["get" + nm] = function () {
    return this[key];
  };
  proto["set" + nm] = function (val: any) {
    this[key] = val;
    return this;
  };
}

// 从base中copy
const string_t = "string";
const integer_t = "integer";
const double_t = "double";
const number_t = "number";
const boolean_t = "boolean";

function toBoolean(v: any): boolean {
  if (v == "true")
    return true;
  else if (v == "false")
    return false;
  return !!v;
}

// 获得模型定义
export function GetModel(obj: any) {
  if (typeof obj == 'function')
    return obj.prototype[FP_KEY];
  return obj[FP_KEY];
}

// 填数据
export function Decode<T>(mdl: T, params: any): T {
  let fps = mdl[FP_KEY];
  if (!fps)
    return null;
  for (let key in params) {
    let fp: FieldOption = fps[key];
    if (fp == null) // 注意这边和core/proto有些不同，不去判断input的类型
      continue;
    let val = params[key];
    if (fp.valtype) {
      if (fp.array) {
        let arr: any[] = [];
        if (val) {
          if (typeof (fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              val.forEach((e: any) => {
                arr.push(asString(e));
              });
            } else if (fp.valtype == integer_t) {
              val.forEach((e: any) => {
                arr.push(toInt(e));
              });
            } else if (fp.valtype == double_t) {
              val.forEach((e: any) => {
                arr.push(toDouble(e));
              });
            } else if (fp.valtype == number_t) {
              val.forEach((e: any) => {
                arr.push(toNumber(e));
              });
            } else if (fp.valtype == boolean_t) {
              val.forEach((e: any) => {
                arr.push(toBoolean(e));
              });
            }
          } else {
            if (fp.valtype == Object) {
              val.forEach((e: any) => {
                arr.push(e);
              });
            } else {
              let clz: any = fp.valtype;
              val.forEach((e: any) => {
                if (e == null) {
                  arr.push(null);
                } else {
                  let t = new clz();
                  Decode(t, e);
                  arr.push(t);
                }
              });
            }
          }
        }
        mdl[key] = arr;
      } else if (fp.map) {
        let keyconv = (v: any) => {
          return v
        };
        if (fp.keytype == integer_t)
          keyconv = toInt;
        else if (fp.keytype == double_t)
          keyconv = toDouble;
        else if (fp.keytype == number_t)
          keyconv = toNumber;
        let map = new Map();
        if (val) {
          if (typeof (fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), asString(ev));
              }
            } else if (fp.valtype == integer_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), toInt(ev));
              }
            } else if (fp.valtype == double_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), toDouble(ev));
              }
            } else if (fp.valtype == number_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), toNumber(ev));
              }
            } else if (fp.valtype == boolean_t) {
              for (let ek in val) {
                let ev = val[ek];
                map.set(keyconv(ek), !!ev);
              }
            }
          } else {
            let clz: any = fp.valtype;
            for (let ek in val) {
              let ev = val[ek];
              if (ev == null) {
                map.set(keyconv(ek), null);
              } else {
                let t = new clz();
                Decode(t, ev);
                map.set(keyconv(ek), t);
              }
            }
          }
        }
        mdl[key] = map;
      } else if (fp.multimap) {
        let keyconv = (v: any) => {
          return v
        };
        if (fp.keytype == integer_t)
          keyconv = toInt;
        else if (fp.keytype == double_t)
          keyconv = toDouble;
        else if (fp.keytype == number_t)
          keyconv = toNumber;
        let mmap = new MultiMap();
        if (val) {
          if (typeof (fp.valtype) == "string") {
            if (fp.valtype == string_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => asString(e)));
              }
            } else if (fp.valtype == integer_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => toInt(e)));
              }
            } else if (fp.valtype == double_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => toDouble(e)));
              }
            } else if (fp.valtype == number_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => toNumber(e)));
              }
            } else if (fp.valtype == boolean_t) {
              for (let ek in val) {
                let ev = val[ek];
                mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => !!e));
              }
            }
          } else {
            let clz: any = fp.valtype;
            for (let ek in val) {
              let ev = val[ek];
              mmap.replace(keyconv(ek), ArrayT.Convert(ev, e => {
                let t = new clz();
                Decode(t, e);
                return t;
              }));
            }
          }
        }
        mdl[key] = mmap;
      } else if (fp.enum) {
        mdl[key] = val ? parseInt(val) : 0;
      } else if (fp.valtype == Object) {
        mdl[key] = val;
      } else if (val) {
        let clz: any = fp.valtype;
        let t = new clz();
        Decode(t, val);
        mdl[key] = t;
      }
    } else {
      if (fp.string)
        mdl[key] = asString(val);
      else if (fp.integer)
        mdl[key] = toInt(val);
      else if (fp.double)
        mdl[key] = toDouble(val);
      else if (fp.number)
        mdl[key] = toNumber(val);
      else if (fp.boolean)
        mdl[key] = toBoolean(val);
      else if (fp.json)
        mdl[key] = val;
      else if (fp.file)
        mdl[key] = val;
      else if (fp.intfloat)
        mdl[key] = IntFloat.From(toInt(val), fp.intfloat);
    }
  }

  // 处理内置参数
  if ("_mid" in params)
    mdl["_mid"] = params["_mid"];

  return mdl;
}

// 把所有input的数据拿出来
function Encode(mdl: any): any {
  let fps = mdl[FP_KEY];
  if (fps == null)
    return null;
  let r: IndexedObject = {};
  for (let key in fps) {
    let fp: FieldOption = fps[key];
    if (!fp.input || !mdl.hasOwnProperty(key))
      continue;
    let v = mdl[key];
    if (v == null)
      continue;
    // 如果是对象，则需要在encode一次
    if (fp.valtype && !fp.enum && typeof fp.valtype != "string") {
      r[key] = JSON.stringify(Encode(v));
    } else if (fp.map) {
      r[key] = JSON.stringify(MapT.ToObject(v));
    } else if (fp.intfloat) {
      r[key] = IntFloat.FromValue(v, fp.intfloat).origin;
    } else {
      r[key] = v;
    }
  }
  return r;
}

// 收集model的输出
function Output(mdl: any): any {
  if (!mdl)
    return {};
  let fps = mdl[FP_KEY];
  let r: IndexedObject = {};
  for (let fk in fps) {
    let fp: FieldOption = fps[fk];
    if (!fp.output)
      continue;
    let val = mdl[fk];
    if (fp.valtype) {
      if (fp.array) {
        // 通用类型，则直接可以输出
        if (typeof (fp.valtype) == "string") {
          r[fk] = val;
        } else {
          // 特殊类型，需要迭代进去
          let arr: any[] = [];
          val && val.forEach((e: any) => {
            arr.push(Output(e));
          });
          r[fk] = arr;
        }
      } else if (fp.map) {
        let m: IndexedObject = {};
        if (val) {
          if (typeof (fp.valtype) == "string") {
            val.forEach((v: any, k: any) => {
              m[k] = v;
            });
          } else {
            val.forEach((v: any, k: any) => {
              m[k] = Output(v);
            });
          }
        }
        r[fk] = m;
      } else if (fp.multimap) {
        let m: IndexedObject = {};
        if (val) {
          if (typeof (fp.valtype) == "string") {
            val.forEach((v: any, k: any) => {
              m[k] = v;
            });
          } else {
            val.forEach((v: any, k: any) => {
              m[k] = ArrayT.Convert(v, e => Output(e));
            });
          }
        }
        r[fk] = m;
      } else if (fp.valtype == Object) {
        r[fk] = val;
      } else {
        r[fk] = Output(val);
      }
    } else if (fp.intfloat) {
      r[fk] = IntFloat.Origin(val);
    } else {
      r[fk] = val;
    }
  }
  return r;
}

export abstract class Base extends Model {
  // --------------从core.proto中移植过来的
  static string_t = "string";
  static integer_t = "integer";
  static double_t = "double";
  static number_t = "number";
  static boolean_t = "boolean";
  static object_t = Object;

  // 可选的参数
  static optional = "optional";

  // 必须的参数，不提供则忽略
  static required = "required";

  // 输入输出
  static input = "input";
  static output = "output";

  static field(id: number, opts: string[], comment?: string): FieldOption {
    return {
      id: id,
      input: opts.indexOf(Base.input) != -1,
      output: opts.indexOf(Base.output) != -1,
      optional: opts.indexOf(Base.optional) != -1,
      comment: comment
    };
  }

  static string(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.string = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static boolean(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.boolean = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static integer(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.integer = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static double(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.double = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static number(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.number = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static intfloat(id: number, scale: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.intfloat = scale;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // 定义数组
  static array(id: number, clz: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.array = true;
    fp.valtype = clz;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // 定义映射表
  static map(id: number, keytyp: clazz_type, valtyp: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.map = true;
    fp.keytype = keytyp;
    fp.valtype = valtyp;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static multimap(id: number, keytyp: clazz_type, valtyp: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.multimap = true;
    fp.keytype = keytyp;
    fp.valtype = valtyp;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // json对象
  static json(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.json = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // 使用其他类型
  static type(id: number, clz: clazz_type, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.valtype = clz;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // 枚举
  static enumerate(id: number, clz: any, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.enum = true;
    fp.valtype = clz;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  // 文件类型
  static file(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp = this.field(id, opts, comment);
    fp.file = true;
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  static filter(id: number, opts: string[], comment?: string): (target: any, key: string) => void {
    let fp: FieldOption = {
      id: id,
      val: "",
      input: opts.indexOf(Base.input) != -1,
      output: opts.indexOf(Base.output) != -1,
      optional: opts.indexOf(Base.optional) != -1,
      filter: true,
      comment: comment
    };
    return (target: any, key: string) => {
      DefineFp(target, key, fp);
    };
  }

  fields(): KvObject<string> {
    return Encode(this);
  }

  unserialize(respn: any): boolean {
    Decode(this, respn.data || respn.message || {});
    return true;
  }

  responseCode(): number {
    return this.response.code;
  }

  responseMessage(): string {
    return this.response.data || this.response.message || '';
  }

  // 构造一个请求对象
  static NewRequest<T extends Base>(req: any): T {
    let clz: any = req[1];
    let r = new clz();
    r.action = req[0];
    return r;
  }
}

export class SocketConnector extends WebSocketConnector {

  // 自动重连
  autoReconnect = true;

  protected onClose(e: CloseEvent) {
    super.onClose(e);

    if (e.code == 1000) {
      // 服务端主动断开的链接，不能进行重连
      let reason = <any>toJsonObject(e.reason);
      switch (reason.code) {
        case -859:
          console.info("没有登录，所以服务器主动断开了连接");
          break;
        case -860:
          console.info("请求了错误的ws协议");
          break;
        case -858:
          console.info("服务器关闭");
          break;
        case -4:
          console.info("多端登录");
          break;
      }
      return;
    } else {
      // 尝试重连
      if (this.autoReconnect) {
        Delay(this._reconnect_counter++, () => {
          this.doReconnect();
        }, this);
      }
    }
  }

  protected onError(e: ErrorEvent) {
    super.onError(e);
    console.log(e.message);

    if (this.autoReconnect) {
      Delay(this._reconnect_counter++, () => {
        this.doReconnect();
      }, this);
    }
  }

  protected doReconnect() {
    console.log("尝试第" + this._reconnect_counter + "次重新连接");
    this.open();
  }

  private _reconnect_counter = 0;

  protected onMessage(data: any, e: MessageEvent) {
    // 需要对data进行处理，把服务端的IMPMessage结构数据提取出来
    super.onMessage({
      _cmid: data.d,
      code: data.s === undefined ? 0 : data.s,
      data: data.p,
      quiet: data.q
    }, e);
  }

  write(d: Model) {
    let params: IndexedObject = {
      _cmid: d.hashCode,
      _sid: this.session.SID,
      _cid: Application.shared.uniqueId(),
      _ts: DateTime.Now(),
      action: d.action,
    };
    let fields = d.fields();
    for (let k in fields) {
      params[k] = fields[k];
    }
    super.write(params);
  }

  watch(d: Model, on: boolean) {
    let params: IndexedObject = {
      _cmid: d.hashCode,
      _sid: this.session.SID,
      _cid: Application.shared.uniqueId(),
      _ts: DateTime.Now(),
      _listen: on ? 1 : 2, // 对应于服务器设置的 ListenMode.LISTEN/UNLISTEN
      action: d.action,
    };
    let fields = d.fields();
    for (let k in fields) {
      params[k] = fields[k];
    }
    super.write(params);
  }
}
