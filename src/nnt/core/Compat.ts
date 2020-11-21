export function formatDate(date: Date, fmt: string): string {
  var o: any = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  var week: any = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

var __PROTO: any = Date.prototype;
__PROTO.pattern = function (fmt: string) {
  return formatDate(this, fmt);
};

export var HashKey = function (o: any) {
  if (o == null)
    return null;
  var tp = typeof (o);
  if (tp == 'string' || tp == 'number' || tp == 'function')
    return o;
  if (o.hashCode)
    return o.hashCode;
  return o.toString();
};

function str_repeat(i: number, m: number) {
  for (var o = []; m > 0; o[--m] = i) ;
  return o.join('');
}

export var printf = function () {
  var i = 0, a;
  var f = arguments[i++];
  var o: any[] = [], m: any, p: any, c: any, x: any, s = '';
  while (f) {
    if ((m = /^[^\x25]+/.exec(f))) {
      o.push(m[0]);
    } else if ((m = /^\x25{2}/.exec(f))) {
      o.push('%');
    } else if ((m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f))) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
        throw('Too few arguments.');
      }
      if (/[^s]/.test(m[7]) && (typeof (a) != 'number')) {
        throw('Expecting number but found ' + typeof (a));
      }
      switch (m[7]) {
        case 'b':
          a = a.toString(2);
          break;
        case 'c':
          a = String.fromCharCode(a);
          break;
        case 'd':
          a = parseInt(a);
          break;
        case 'e':
          a = m[6] ? a.toExponential(m[6]) : a.toExponential();
          break;
        case 'f':
          a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
          break;
        case 'o':
          a = a.toString(8);
          break;
        case 's':
          a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
          break;
        case 'u':
          a = Math.abs(a);
          break;
        case 'x':
          a = a.toString(16);
          break;
        case 'X':
          a = a.toString(16).toUpperCase();
          break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length - s.length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(s + (m[4] ? a + p : p + a));
    } else {
      throw('Huh ?!');
    }
    f = f.substring(m[0].length);
  }
  return o.join('');
}

export var guid = function () {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export var uuid = function (len: number, radix: number) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

export function loadScript(src: string): Promise<void> {
  return new Promise<void>(resolve => {
    var s: any = document.createElement('script');
    s.src = src;
    if (s.hasOwnProperty("async")) {
      s.async = true;
    }
    var fun = function () {
      this.removeEventListener('load', fun, false);
      resolve();
    };
    s.addEventListener('load', fun, false);
    s.addEventListener('error', fun, false);
    document.body.appendChild(s);
  });
}

export function loadStyle(src: string): Promise<void> {
  return new Promise<void>(resolve => {
    var s: any = document.createElement('link');
    s.setAttribute("rel", "stylesheet");
    s.setAttribute("type", "text/css");
    s.setAttribute("href", src);
    document.body.appendChild(s);
    resolve();
  });
}

if (typeof console.exception == "undefined") {
  console.exception = console.error;
}
