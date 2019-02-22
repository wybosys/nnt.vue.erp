import {IndexedObject, toJsonObject} from "./Kernel";
import {HttpConnector} from "./Connector";
import {SignalFailed, SignalSucceed} from "./Signals";
import {ModelError, STATUS} from "./Model";
import {config} from "./Config";

export function Fetch(url: string, args: IndexedObject): Promise<IndexedObject> {
  return new Promise<IndexedObject>((resolve, reject) => {
    let cnt = new HttpConnector();
    cnt.url = url;
    cnt.fields = args;
    cnt.signals.connect(SignalSucceed, () => {
      let data = cnt.data;
      if (config.get('DEBUG')) {
        console.log('返回 ' + cnt.data)
      }

      data = toJsonObject(data);
      if (data.code == 0) {
        resolve(data.message || data.data);
      } else {
        reject(new ModelError(data.code));
      }
    }, null);
    cnt.signals.connect(SignalFailed, () => {
      reject(new ModelError(STATUS.THIRD_FAILED));
    }, null);
    cnt.start();

    if (config.get('DEBUG')) {
      console.log('请求 ' + cnt.fullUrl());
    }
  });
}

export function Get(url: string, args: IndexedObject): Promise<IndexedObject> {
  try {
    return Fetch(url, args);
  } catch (e) {
    // pass
  }
  return null;
}

