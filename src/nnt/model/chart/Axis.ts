type AxisDataSourceType = () => Promise<any[]>;

export class Axis {

  // 数据源
  dataSource?: AxisDataSourceType;

  // 数据
  data?: any[];
}
