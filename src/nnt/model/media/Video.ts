export interface IVideo {

  // 视频源
  source: string;

  // 视频类型
  type: string;
}

export class Video implements IVideo {

  // 视频源
  source: string;

  get type(): string {
    if (this.source.indexOf('.mp4') != -1)
      return "video/mpeg4";
    return ''
  }
}
