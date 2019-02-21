// 请不要修改该自动生成的文件

import {Model} from "./model-impl";

class ApiModel extends Model {
  domain = "devops/media";
}


export enum ImageSupport {

      IMAGE = 0,

}

export enum AudioSupport {

      MP3 = 0,

      SPX = 1,

      AMR = 2,

}





export class UploadFile extends ApiModel {

      @Model.enumerate(1, ImageSupport, [Model.input, Model.optional], "文件类型")
      type?:ImageSupport;

      @Model.file(2, [Model.input], "文件对象")
      file:any;

      @Model.string(3, [Model.output], "文件在服务器上的路径")
      path:string;

}

export class DownloadFile extends ApiModel {

      @Model.enumerate(1, ImageSupport, [Model.input, Model.optional], "文件类型")
      type?:ImageSupport;

      @Model.string(2, [Model.input], "源")
      source:string;

      @Model.string(3, [Model.output], "文件在服务器上的路径")
      path:string;

}

export class GetFile extends ApiModel {

      @Model.enumerate(1, ImageSupport, [Model.input, Model.optional], "文件类型")
      type?:ImageSupport;

      @Model.string(2, [Model.input], "文件名")
      name:string;

      @Model.string(3, [Model.input, Model.optional], "滤镜")
      filter?:string;

}

export class QrCodeGenerate extends ApiModel {

      @Model.string(1, [Model.input], "内容")
      content:string;

}

export class GetAudio extends ApiModel {

      @Model.enumerate(1, AudioSupport, [Model.input, Model.optional], "文件类型")
      type?:AudioSupport;

      @Model.string(2, [Model.input], "文件名")
      name:string;

}

export class UploadAudio extends ApiModel {

      @Model.enumerate(1, AudioSupport, [Model.input, Model.optional], "文件类型")
      type?:AudioSupport;

      @Model.file(2, [Model.input], "文件对象")
      file:any;

      @Model.string(3, [Model.output], "文件在服务器上的路径")
      path:string;

}

export class DownloadAudio extends ApiModel {

      @Model.enumerate(1, AudioSupport, [Model.input, Model.optional], "文件类型")
      type?:AudioSupport;

      @Model.string(2, [Model.input], "源")
      source:string;

      @Model.string(3, [Model.output], "文件在服务器上的路径")
      path:string;

}



export let RImagestoreUpload = ["imagestore.upload", UploadFile, ""];

export let RImagestoreDownload = ["imagestore.download", DownloadFile, ""];

export let RImagestoreUse = ["imagestore.use", GetFile, ""];

export let RImagestoreQrcode = ["imagestore.qrcode", QrCodeGenerate, "生成二维码"];

export let RAudiostoreUpload = ["audiostore.upload", UploadAudio, ""];

export let RAudiostoreUse = ["audiostore.use", GetAudio, ""];

export let RAudiostoreDownload = ["audiostore.download", DownloadAudio, ""];



export function ImagestoreUpload():UploadFile {
  return Model.NewRequest(RImagestoreUpload);
}

export function ImagestoreDownload():DownloadFile {
  return Model.NewRequest(RImagestoreDownload);
}

export function ImagestoreUse():GetFile {
  return Model.NewRequest(RImagestoreUse);
}

export function ImagestoreQrcode():QrCodeGenerate {
  return Model.NewRequest(RImagestoreQrcode);
}

export function AudiostoreUpload():UploadAudio {
  return Model.NewRequest(RAudiostoreUpload);
}

export function AudiostoreUse():GetAudio {
  return Model.NewRequest(RAudiostoreUse);
}

export function AudiostoreDownload():DownloadAudio {
  return Model.NewRequest(RAudiostoreDownload);
}

