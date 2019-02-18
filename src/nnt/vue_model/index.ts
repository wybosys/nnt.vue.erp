export class TableTitle {

  /*数据对应api的参数名*/
  type: string;

  /*该参数以何种中文名展现在表格中*/
  title: string;

  /*是否固定该列*/
  fixed: boolean;

  /*是否隐藏该列*/
  hidden: boolean; // 默认为false
}
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

