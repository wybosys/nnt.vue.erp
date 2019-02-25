export interface ISeqPaged {

  // 排序依赖的最大数值
  last: number;

  // 一次拉取多少个
  limit: number;

  // 数据总数
  total: number;
}

export class SeqPaged implements ISeqPaged {

  constructor(limit: number = 10) {
    this.limit = limit;
  }

  // 排序依赖的最大数值
  last: number = -1;

  // 一次拉取多少个
  limit: number;

  // 数据总数
  total: number = 0;
}

export interface INumPaged {

  // 请求的页码
  page: number;

  // 单页多少条数据
  limit: number;

  // 数据总数
  total: number;
}

export class NumPaged implements INumPaged {

  constructor(limit: number = 10) {
    this.limit = limit;
  }

  // 请求的页码
  page: number = 0;

  // 单页多少条数据
  limit: number;

  // 数据总数
  total: number = 0;
}
