import {Axis} from "./Axis";
import {Serie} from "./Serie";
import {Title} from "./Title";
import {Series} from "./Series";

export abstract class Chart {

  protected _series: Serie[] = [];

  // 标题
  title?: Title;

  // 当前数据序列
  series?: Series;
}

// 普通2d图表
export class Chart2D extends Chart {

  // 坐标轴
  axisX = new Axis();
  axisY = new Axis();
}

// 普通3d图表
export class Chart3D extends Chart2D {

  axisZ = new Axis();
}

// 2d极坐标图标
export class ChartPolar2D extends Chart {

  axisAngle = new Axis();

}
