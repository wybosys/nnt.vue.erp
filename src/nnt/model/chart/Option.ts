import {Series} from "./Series";

export class Option {
  type: string;  // bar-树状图  line-折线图
  title: string;  //标题
  xAxis: string;  //讲api中哪个数据作用于x轴  ps：'date'
  series: Array<Series>  //映射的数据
}
