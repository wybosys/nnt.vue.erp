// 请不要修改该自动生成的文件

import {Model} from "./model-impl";

class ApiModel extends Model {
  domain = "framework/nntlogicjvm";
}


export enum STATUS {
  
      UNKNOWN = -1000,
  
      EXCEPTION = -999,
  
      ROUTER_NOT_FOUND = -998,
  
      CONTEXT_LOST = -997,
  
      MODEL_ERROR = -996,
  
      PARAMETER_NOT_MATCH = -995,
  
      NEED_AUTH = -994,
  
      TYPE_MISMATCH = -993,
  
      FILESYSTEM_FAILED = -992,
  
      FILE_NOT_FOUND = -991,
  
      ARCHITECT_DISMATCH = -990,
  
      SERVER_NOT_FOUND = -989,
  
      LENGTH_OVERFLOW = -988,
  
      TARGET_NOT_FOUND = -987,
  
      PERMISSION_FAILED = -986,
  
      WAIT_IMPLEMENTION = -985,
  
      ACTION_NOT_FOUND = -984,
  
      TARGET_EXISTS = -983,
  
      STATE_FAILED = -982,
  
      UPLOAD_FAILED = -981,
  
      MASK_WORD = -980,
  
      SELF_ACTION = -979,
  
      PASS_FAILED = -978,
  
      OVERFLOW = -977,
  
      AUTH_EXPIRED = -976,
  
      SIGNATURE_ERROR = -975,
  
      FORMAT_ERROR = -974,
  
      CONFIG_ERROR = -973,
  
      PRIVILEGE_ERROR = -972,
  
      LIMIT = -971,
  
      PAGED_OVERFLOW = -970,
  
      NEED_ITEMS = -969,
  
      DECODE_ERROR = -968,
  
      ENCODE_ERROR = -967,
  
      IM_CHECK_FAILED = -899,
  
      IM_NO_RELEATION = -898,
  
      SOCK_WRONG_PORTOCOL = -860,
  
      SOCK_AUTH_TIMEOUT = -859,
  
      SOCK_SERVER_CLOSED = -858,
  
      SECURITY_FAILED = -6,
  
      THIRD_FAILED = -5,
  
      MULTIDEVICE = -4,
  
      HFDENY = -3,
  
      TIMEOUT = -2,
  
      FAILED = -1,
  
      OK = 0,
  
}

export enum EchoType {
  
      TEST = 88,
  
}





export class AuthedNull extends ApiModel {
  
}

export class NumPaged extends ApiModel {
  
      @Model.integer(2, [Model.input, Model.optional], "单页多少条数据")
      limit?:number;
  
      @Model.integer(1, [Model.input, Model.output, Model.optional], "请求的页码")
      page?:number;
  
      @Model.integer(3, [Model.output], "数据总数")
      total:number;
  
}

export class RestUpdate extends ApiModel {
  
      @Model.integer(1, [Model.output], "心跳间隔")
      heartbeatTime:number;
  
      @Model.json(2, [Model.output])
      models:Object;
  
}

export class Null extends ApiModel {
  
}

export class SeqPaged extends ApiModel {
  
      @Model.integer(1, [Model.input, Model.output, Model.optional], "排序依赖的最大数值")
      last?:number;
  
      @Model.integer(2, [Model.input, Model.optional], "一次拉取多少个")
      limit?:number;
  
      @Model.integer(3, [Model.output], "数据总数")
      total:number;
  
}

export class C extends ApiModel {
  
}

export class B extends C {
  
}

export class Echoo extends ApiModel {
  
      @Model.array(6, Model.double_t, [Model.output])
      array:Array<number>;
  
      @Model.string(11, [Model.input, Model.output])
      content:string;
  
      @Model.enumerate(7, EchoType, [Model.output])
      enm:EchoType;
  
      @Model.string(1, [Model.input], "输入")
      input:string;
  
      @Model.json(4, [Model.output])
      json:Object;
  
      @Model.map(5, Model.string_t, Model.integer_t, [Model.output])
      map:Map<string,number>;
  
      @Model.type(8, Null, [Model.output])
      nullval:Null;
  
      @Model.boolean(9, [Model.input])
      ok:boolean;
  
      @Model.string(2, [Model.output], "输出")
      output:string;
  
      @Model.integer(3, [Model.output], "服务器时间")
      time:number;
  
      @Model.integer(10, [Model.input])
      value:number;
  
}

export class A extends B {
  
}



export let RTestEcho = ["Test.echo", Echoo, ""];



export function TestEcho():Echoo {
  return Model.NewRequest(RTestEcho);
}
