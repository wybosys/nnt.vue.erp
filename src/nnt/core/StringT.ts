import {Invoke1} from "./Typescript";
import {printf} from "./Compat";

/** 格式化字符串 */
export function formatString(fmt: string, ...p: any[]): string {
  try {
    return Invoke1(printf, null, p, fmt);
  } catch (err) {
    console.exception('format: ' + fmt + '\nargus: ' + p + '\n' + err);
  }
  return '';
}

export function formatStringV(fmt: string, p: any[]): string {
  try {
    return Invoke1(printf, null, p, fmt);
  } catch (err) {
    console.exception('format: ' + fmt + '\nargus: ' + p + '\n' + err);
  }
  return '';
}

/** 格式化字符对象 */
export class FormatString {
  constructor(fmt?: any, ...args: any[]) {
    this.fmt = fmt;
    this.args = args;
  }

  /** fmt 根据业务的实现，可能为int的id，一般情况下为string，所以设置为any兼容业务的复杂性 */
  fmt: any;

  /** 带上的参数 */
  args: any[];

  toString(): string {
    return formatStringV(this.fmt, this.args);
  }
}

/** 操作 string */
export class StringT {
  /** 优化显示float
   @param v 输入的数字
   @param dp decimalplace 小数位
   @param term 是否去除末尾的0
   */
  static FormatFloat(v: number, dp: number, term: boolean = true): string {
    let s = formatString('%.' + dp + 'f', v);
    if (term)
      s = this.TermFloat(s);
    return s;
  }

  // 去除掉float后面的0
  static TermFloat(str: string): string {
    let lr = str.split('.');
    if (lr.length != 2) {
      console.error("传入的 stirng 格式错误");
      return str;
    }

    let ro = lr[1], m = false, rs = '';
    for (let i = ro.length; i > 0; --i) {
      let c = ro[i - 1];
      if (!m && c != '0')
        m = true;
      if (m)
        rs = c + rs;
    }
    if (rs.length == 0)
      return lr[0];
    return lr[0] + '.' + rs;
  }

  static Hash(str: string): number {
    let hash = 0;
    if (str.length == 0)
      return hash;
    for (let i = 0; i < str.length; ++i) {
      hash = (((hash << 5) - hash) + str.charCodeAt(i)) & 0xffffffff;
    }
    return hash;
  }

  static Count(str: string, substr: string): number {
    let pos = str.indexOf(substr);
    if (pos == -1)
      return 0;
    let r = 1;
    r += this.Count(str.substr(pos + substr.length), substr);
    return r;
  }

  /** 计算ascii的长度 */
  static AsciiLength(str: string): number {
    let r = 0;
    for (let i = 0; i < str.length; ++i) {
      let c = str.charCodeAt(i);
      r += c > 128 ? 2 : 1;
    }
    return r;
  }

  /** 拆分，可以选择是否去空 */
  static Split(str: string, sep: string, skipempty: boolean = true): string[] {
    let r = str.split(sep);
    let r0: any[] = [];
    r.forEach((e: string) => {
      if (e.length)
        r0.push(e);
    });
    return r0;
  }

  /** 拉开，如果不足制定长度，根据mode填充
   @param mode 0:中间填充，1:左边填充，2:右边填充
   @param wide 是否需要做宽字符补全，如果str为中文并且sep为单字节才需要打开
   */
  static Stretch(str: string, len: number, mode: number = 0, sep: string = ' ', wide = true): string {
    if (str.length >= len)
      return str;
    if (str.length == 0) {
      let r = '';
      while (len--)
        r += sep;
      return r;
    }
    let n = len - str.length;
    let r = '';
    switch (mode) {
      case 0: {
        let c = (len - str.length) / (str.length - 1);
        if (wide)
          c *= 2;
        if (c >= 1) {
          // 每个字符后面加sep
          for (let i = 0; i < str.length - 1; ++i) {
            r += str[i];
            for (let j = 0; j < c; ++j)
              r += sep;
          }
          r += str[str.length - 1];
        } else {
          r = str;
        }
        // 如果不匹配，则补全
        if (r.length < len) {
          n = len - str.length;
          if (wide)
            n *= 2;
          while (n--)
            r += sep;
        }
      }
        break;
      case 1: {
        while (n--)
          r = sep + r;
        r += str;
      }
        break;
      case 2: {
        r = str;
        while (n--)
          r += sep;
      }
        break;
    }
    return r;
  }

  static Code(s: string): number[] {
    let r = [];
    let l = s.length;
    for (let i = 0; i < l; ++i)
      r.push(s.charCodeAt(i));
    return r;
  }

  static FromCode(c: number[]): string {
    return String.fromCharCode.apply(null, c);
  }

  // 小写化
  static Lowercase(str: string, def = ""): string {
    return str ? str.toLowerCase() : def;
  }

  static Uppercase(str: string, def = ""): string {
    return str ? str.toUpperCase() : def;
  }

  static UpcaseFirst(str: string): string {
    if (!str || !str.length)
      return "";
    return str[0].toUpperCase() + str.substr(1);
  }

  static FromArrayBuffer(buf: ArrayBuffer): string {
    let bytes = new Uint8Array(buf);
    let out, i, len, c;
    let char2, char3;
    out = "";
    len = bytes.length;
    i = 0;
    while (i < len) {
      c = bytes[i++];
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2 = bytes[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = bytes[i++];
          char3 = bytes[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0));
          break;
      }
    }
    return out;
  }

  // 标准的substr只支持正向，这里实现的支持两个方向比如，substr(1, -2)
  static SubStr(str: string, pos: number, len?: number): string {
    if (len == null || len >= 0)
      return str.substr(pos, len);
    if (pos < 0)
      pos = str.length + pos;
    pos += len;
    let of = 0;
    if (pos < 0) {
      of = pos;
      pos = 0;
    }
    return str.substr(pos, -len + of);
  }

  static Repeat(str: string, count: number = 1): string {
    let r = "";
    while (count--) {
      r += str;
    }
    return r;
  }
}
