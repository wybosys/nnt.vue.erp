export function StringToBlob(str: string): Blob {
  let buf = new ArrayBuffer(str.length);
  let view = new Uint8Array(buf);
  for (let i = 0, l = str.length; i != l; ++i) {
    view[i] = str.charCodeAt(i) & 0xFF;
  }
  return new Blob([view], {type: "application/octet-stream"});
}

export function SendToDownload(data: Blob, file: string) {
  let url = URL.createObjectURL(data); // 创建blob地址
  let ta = document.createElement('a');
  ta.href = url;
  ta.download = file; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  let te;
  if (typeof MouseEvent != 'undefined') {
    te = new MouseEvent('click');
  } else {
    te = document.createEvent('MouseEvents');
    te.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  ta.dispatchEvent(te);
}
