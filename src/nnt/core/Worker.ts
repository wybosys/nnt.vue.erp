import {IndexedObject, StringT} from "./Kernel";

export function WorkerFromString(str: string): Worker {
  let b = new Blob([str], {type: 'application/javascript'});
  let url = window.URL.createObjectURL(b);
  return new Worker(url);
}

let services: IndexedObject = {};

export function StartService(url: string, cb: (w: Worker) => void) {
  let key = StringT.Hash(url);
  if (key in services) {
    cb(services[key]);
    return;
  }

  try {
    let work = new Worker(url);
    services[key] = work;
    cb(work);
  }
  catch (err) {
    services[key] = null;
    cb(null);
  }
}
