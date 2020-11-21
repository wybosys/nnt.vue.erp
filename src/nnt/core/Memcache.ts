import {ICacheObject, ICacheRecord, IShared} from "./Kernel";
import {KvObject} from "./Stl";
import {DateTime} from "./DateTime";
import {ArrayT} from "./ArrayT";
import {ObjectT} from "./ObjectT";

export class CacheRecord implements ICacheRecord {
  key: string; // 键
  val: any; // 数据对象
  ts: number; // 时间戳

  count: number = 0; // 计数器
  fifo: boolean; // 位于fifo中
  mulo: boolean; // 位于mulo中

  get isnull(): boolean {
    return this.val == null;
  }

  use(): any {
    this.count += 1;
    return this.val;
  }

  prop(k: any, v: any) {
    if (this.val)
      this.val[k] = v;
  }

  grab() {
    this.count += 1;
  }

  drop() {
    this.count -= 1;
  }
}

/** 基础缓存实现 */
export class Memcache implements IShared {
  // 存储所有的对象，用来做带key的查找
  protected _maps = new KvObject<CacheRecord>();
  protected _records = new Array<CacheRecord>();

  // 是否启用
  enable: boolean = true;

  /** 添加一个待缓存的对象 */
  cache<T extends ICacheObject>(obj: T): CacheRecord {
    if (!this.enable) {
      let t = new CacheRecord();
      t.val = obj.valueForCache();
      return t;
    }

    let ks = obj.keyForCache();
    if (ks == null) {
      console.error("放到缓存中的对象没有提供 mcKey");
      return null;
    }

    // 查找老的
    let rcd: CacheRecord = this._maps[ks];
    if (rcd) {
      rcd.val = obj.valueForCache();
      rcd.ts = obj.cacheTime > 0 ? obj.cacheTime + DateTime.Now() : 0;
      return rcd;
    }

    // 初始化一个新的缓存记录
    rcd = new CacheRecord();
    rcd.key = ks;
    rcd.val = obj.valueForCache();
    rcd.ts = obj.cacheTime > 0 ? obj.cacheTime + DateTime.Now() : 0;

    this._records.push(rcd);
    this._maps[ks] = rcd;

    // todo GC得操作
    return rcd;
  }

  // 执行一次淘汰验证
  gc() {
    let rms = ArrayT.RemoveObjectsByFilter(this._records, (rcd: CacheRecord): boolean => {
      return rcd.count <= 0;
    });
    rms.forEach((rcd: CacheRecord) => {
      this.doRemoveObject(rcd);
    });
  }

  /** 获得缓存对象 */
  query(ks: string): ICacheRecord {
    let rcd: CacheRecord = this._maps[ks];
    if (rcd == null)
      return null;
    if (rcd.ts > 0 && rcd.ts <= DateTime.Now()) {
      // 为了下一次将过期的清理掉
      rcd.count = 0;
      return null;
    }
    return rcd;
  }

  /** override 回调处理移除一个元素 */
  protected doRemoveObject(rcd: CacheRecord) {
    ObjectT.RemoveKey(this._maps, rcd.key);
  }

  static shared = new Memcache();
}
