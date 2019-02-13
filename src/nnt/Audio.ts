import {DataMedia, Media} from "./Media";
import {StartService, WorkerFromString} from "./Worker";
import {config} from "./Config";

export let WORKER_RECORDER =
  "function init(e){sampleRate=e.sampleRate,numChannels=e.numChannels,initBuffers()}function record(e){for(var n=0;n<numChannels;n++)recBuffers[n].push(e[n]);recLength+=e[0].length}function exportWAV(e){for(var n=[],t=0;t<numChannels;t++)n.push(mergeBuffers(recBuffers[t],recLength));if(2===numChannels)r=interleave(n[0],n[1]);else var r=n[0];var a=encodeWAV(r),s=new Blob([a],{type:e});this.postMessage(s)}function getBuffer(){for(var e=[],n=0;n<numChannels;n++)e.push(mergeBuffers(recBuffers[n],recLength));this.postMessage(e)}function clear(){recLength=0,recBuffers=[],initBuffers()}function initBuffers(){for(var e=0;e<numChannels;e++)recBuffers[e]=[]}function mergeBuffers(e,n){for(var t=new Float32Array(n),r=0,a=0;a<e.length;a++)t.set(e[a],r),r+=e[a].length;return t}function interleave(e,n){for(var t=e.length+n.length,r=new Float32Array(t),a=0,s=0;a<t;)r[a++]=e[s],r[a++]=n[s],s++;return r}function floatTo16BitPCM(e,n,t){for(var r=0;r<t.length;r++,n+=2){var a=Math.max(-1,Math.min(1,t[r]));e.setInt16(n,a<0?32768*a:32767*a,!0)}}function writeString(e,n,t){for(var r=0;r<t.length;r++)e.setUint8(n+r,t.charCodeAt(r))}function encodeWAV(e){var n=new ArrayBuffer(44+2*e.length),t=new DataView(n);return writeString(t,0,\"RIFF\"),t.setUint32(4,36+2*e.length,!0),writeString(t,8,\"WAVE\"),writeString(t,12,\"fmt \"),t.setUint32(16,16,!0),t.setUint16(20,1,!0),t.setUint16(22,numChannels,!0),t.setUint32(24,sampleRate,!0),t.setUint32(28,4*sampleRate,!0),t.setUint16(32,2*numChannels,!0),t.setUint16(34,16,!0),writeString(t,36,\"data\"),t.setUint32(40,2*e.length,!0),floatTo16BitPCM(t,44,e),t}var recLength=0,recBuffers=[],sampleRate,numChannels;this.onmessage=function(e){switch(e.data.command){case\"init\":init(e.data.config);break;case\"exit\":self.close();break;case\"record\":record(e.data.buffer);break;case\"exportWAV\":exportWAV(e.data.type);break;case\"getBuffer\":getBuffer();break;case\"clear\":clear()}};";

let PLAYING = false;
let RECORDING = false;

export class AudioRecorder {

  private static _VALID: boolean;

  static IsValid(cb: (support: boolean) => void) {
    if (AudioRecorder._VALID != null) {
      cb(AudioRecorder._VALID);
      return;
    }

    if (typeof AudioContext == "undefined") {
      AudioRecorder._VALID = false;
      cb(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({audio: true}).then(() => {
      AudioRecorder._VALID = true;
      cb(true);
    }).catch(() => {
      AudioRecorder._VALID = false;
      cb(false);
    });
  }

  bufferlen = 4096; // 缓冲区大小
  channels = 1; // 通道数量

  protected _ctx: AudioContext;
  protected _recorder: Worker;
  protected _player: HTMLAudioElement;
  protected _data: Blob;

  // 开始录音
  start(cb?: (err: Error) => void) {
    if (PLAYING) {
      cb && cb(new Error("正在回放"));
      return;
    }
    if (RECORDING) {
      cb && cb(new Error("正在录音"));
      return;
    }

    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      try {
        this._ctx = new AudioContext();
        RECORDING = true;
        this.doStart(stream, cb);
      }
      catch (err) {
        cb && cb(err);
      }
    }).catch(() => {
      cb && cb(new Error("当前设备不支持录音"));
    })
  }

  // 结束录音或者结束回放
  stop(cb?: (media?: Media) => void) {
    if (RECORDING) {
      this._cbStopped = cb;

      // 先提取出wav数据
      this._recorder.postMessage({
        command: "exportWAV",
        type: "audio/wav"
      });
    }
    else if (PLAYING) {
      PLAYING = false;
      this._player.pause();
      this._player = null;
      cb && cb(null);
    }
    else {
      cb && cb(null);
    }
  }

  // 回放录音
  play(cb?: (err: Error) => void) {
    if (PLAYING) {
      cb && cb(new Error("正在回放"));
      return;
    }
    if (RECORDING) {
      cb && cb(new Error("正在录音"));
      return;
    }
    PLAYING = true;
    let reader = new FileReader();
    reader.onload = (e: any) => {
      this._player = new Audio(e.target.result);
      this._player.addEventListener("ended", () => {
        PLAYING = false;
      });
      this._player.play();
      cb && cb(null);
    };
    reader.onerror = e => {
      PLAYING = false;
      cb && cb(new Error("录音失败"));
    };
    reader.readAsDataURL(this._data);
  }

  protected doStart(stream: MediaStream, cb: (err: Error) => void) {
    let source = this._ctx.createMediaStreamSource(stream);
    let node = this._ctx.createScriptProcessor(this.bufferlen, this.channels, this.channels);
    this._recorder = WorkerFromString(WORKER_RECORDER);
    this._recorder.postMessage({
      command: "init",
      config: {
        sampleRate: this._ctx.sampleRate,
        numChannels: this.channels
      }
    });
    node.onaudioprocess = e => {
      if (!this._recorder)
        return;
      let buffers = [];
      for (let i = 0; i < this.channels; ++i)
        buffers.push(e.inputBuffer.getChannelData(i));
      this._recorder.postMessage({
        command: "record",
        buffer: buffers
      })
    };
    this._recorder.onmessage = e => {
      this._data = e.data;
      RECORDING = false;

      // 提取数据成功，关闭
      this._recorder.postMessage({
        command: "clear"
      });
      this._recorder.postMessage({
        command: "exit"
      });
      this._recorder = null;

      this._ctx.close();
      this._ctx = null;

      if (this._cbStopped) {
        // 结束后自动转换成media对象
        this.doStop(this._cbStopped);
        this._cbStopped = null;
      }
    };
    source.connect(node);
    node.connect(this._ctx.destination);
    cb && cb(null);
  }

  private _cbStopped: (media: Media) => void;

  // 保存时使用的参数
  sampleRate: number;
  bitRate: number;

  protected doStop(cb: (media: Media) => void) {
    // 从服务器上启动mp3编码服务
    StartService(config.THIRDLIBS + "/mp3encoder.js", worker => {
      if (!worker) {
        cb(null);
        return;
      }
      let reader = new FileReader();
      reader.onload = (e: any) => {
        worker.postMessage({
          cmd: "init",
          config: {
            channels: 1,
            mode: 3,
            samplerate: this.sampleRate ? this.sampleRate : null,
            bitrate: this.bitRate ? this.bitRate : null
          }
        });
        let arrbuf = e.target.result;
        let buffer = new Uint8Array(arrbuf);
        let wav = ParseWav(buffer);

        worker.onmessage = e => {
          if (e.data.cmd != "data")
            return;
          let mp3Blob = new Blob([new Uint8Array(e.data.buf)], {type: 'audio/mpeg'});
          let reader = new FileReader();
          reader.onload = (e: any) => {
            cb(new DataMedia(e.target.result));
          };
          reader.readAsDataURL(mp3Blob);
        };

        worker.postMessage({
          cmd: "encode",
          buf: Uint8ArrayToFloat32Array(wav.samples)
        });
        worker.postMessage({
          cmd: "finish"
        });
      };
      reader.readAsArrayBuffer(this._data);
    });
  }
}

function Uint8ArrayToFloat32Array(u8a: Uint8Array) {
  var f32Buffer = new Float32Array(u8a.length);
  for (var i = 0; i < u8a.length; i++) {
    var value = u8a[i << 1] + (u8a[(i << 1) + 1] << 8);
    if (value >= 0x8000) value |= ~0x7FFF;
    f32Buffer[i] = value / 0x8000;
  }
  return f32Buffer;
}

function ParseWav(wav: Uint8Array) {
  function readInt(i: number, bytes: number) {
    var ret = 0,
      shft = 0;

    while (bytes) {
      ret += wav[i] << shft;
      shft += 8;
      i++;
      bytes--;
    }
    return ret;
  }

  if (readInt(20, 2) != 1) throw 'Invalid compression code, not PCM';
  if (readInt(22, 2) != 1) throw 'Invalid number of channels, not 1';
  return {
    sampleRate: readInt(24, 4),
    bitsPerSample: readInt(34, 2),
    samples: wav.subarray(44)
  };
}
