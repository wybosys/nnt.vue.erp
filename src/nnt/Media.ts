export abstract class Media {
  // 保存成string（一般为base64/data）格式
  abstract save(): any;
}

export class DataMedia extends Media {

  constructor(data: string) {
    super();
    this._data = data;
  }

  private _data: string;

  save(): any {
    return this._data;
  }
}

export class UrlMedia extends Media {

  constructor(url: string) {
    super();
    this._url = url;
  }

  private _url: string;

  save(): any {
    return this._url;
  }
}
