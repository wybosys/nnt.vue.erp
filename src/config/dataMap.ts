class seriesMap {
  name: string;  // 该数据名称
  type: string;  //该数据api中对应的参数  /* {name: '总分享次数',type: 'allcount'}  */
}

export class MChartOption {
  type: string;  // bar-树状图  line-折线图
  title: string;  //标题
  xAxis: string;  //讲api中哪个数据作用于x轴  ps：'date'
  series: Array<seriesMap>  //映射的数据
}

