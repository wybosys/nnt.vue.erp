import {isZero} from "./Kernel";
import {KvObject} from "./Stl";
import {ObjectT} from "./ObjectT";

export class UrlT {
  constructor(uri?: string) {
    if (uri)
      this.parseString(uri);
  }

  parseString(uri: string) {
    if (isZero(uri)) {
      console.log("不能解析传入的 URI 信息");
      return;
    }

    let s = uri.split('?');
    if (s.length == 1)
      s = ['', s[0]];
    this.domain = s[0];
    let fs = s[1];
    if (fs && fs.length) {
      fs.split('&').forEach((s) => {
        if (!s || s.length == 0)
          return;
        let fs = s.split('=');
        this.fields[fs[0]] = fs[1] ? fs[1] : null;
      });
    }
  }

  fields = new KvObject<string>();
  domain = '';

  toString(): string {
    let r = '';
    if (this.domain.length) {
      if (/\:\/\//i.test(this.domain) == false)
        r += 'http://';
      r += this.domain;
      if (this.domain.indexOf('?') == -1 &&
        !ObjectT.IsEmpty(this.fields))
        r += '?';
    }
    r += UrlT.MapToField(this.fields);
    return r;
  }

  static MapToField(m: KvObject<any>): string {
    let arr: any[] = [];
    ObjectT.Foreach(m, (k, v) => {
      arr.push(k + "=" + this.encode(v));
    }, this);
    return arr.join('&');
  }

  static encode(str: string): string {
    return encodeURIComponent(str);
  }

  static decode(d: string): string {
    return decodeURIComponent(d);
  }

  /** 字符串打包，encode测试发现在native状态下，如果使用urlloader发送，则放在参数中的例如http://之类的字符串会被恢复编码，导致500错误 */
  static pack(str: string, uri: boolean = true): string {
    let r = btoa(str);
    if (uri)
      return encodeURIComponent(r);
    return r;
  }

  static unpack(str: string, uri: boolean = true): string {
    let r = atob(str);
    if (uri)
      return decodeURIComponent(r);
    return r;
  }

  static htmlEncode(s: string): string {
    if (s.length == 0)
      return "";
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    return s;
  }

  static htmlDecode(s: string): string {
    if (s.length == 0)
      return "";
    s = s.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
  }
}
