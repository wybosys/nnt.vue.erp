import md5 from 'js-md5';
import {Base, Decode} from "../core/Logic";
import {config} from "../core/Config";
import {Fetch} from "../core/Remote";
import {storagable} from "../core/Storage";

export class SdkAdminLogin {
  @Base.string(1, [Base.input], "account")
  account: string;

  @Base.string(2, [Base.input], "password")
  password: string;

  @Base.string(3, [Base.output], "sid")
  sid: string;
}

export class SdkMerchantLogin {
  @Base.string(1, [Base.input], "account")
  account: string;

  @Base.string(2, [Base.input], "password")
  password: string;

  @Base.integer(3, [Base.input], "merchantid")
  merchantid: number;

  @Base.string(4, [Base.output], "sid")
  sid: string;
}

export class SdkMerchantVerify {

  @Base.string(1, [Base.input], "sid")
  sid: string;
}

export class SdkMerchantInfo {
  @Base.integer(1, [Base.output], "id")
  id: number;

  @Base.string(2, [Base.output], "name")
  name: string;

  @Base.string(5, [Base.output], "account")
  account: string;
}

export class Sdks {

  protected hosts = config.get('DEBUG') ? 'http://develop.91egame.com' : 'https://apps.91yigame.com';

  admins = this.hosts + "/platform/admins/";
  merchants = this.hosts + "/platform/merchants/";

  // 加密管理员密码
  static AdminEncryptPassword(pwd: string): string {
    return md5('yyp' + pwd + 'yyp');
  }

  // 加密商户密码
  static MerchantEncryptPassword(pwd: string): string {
    return md5('yyp' + pwd + 'yyp');
  }

  @storagable('::sdks::sid')
  private _sid: string;

  // 管理员登录
  async adminLogin(m: SdkAdminLogin): Promise<SdkAdminLogin> {
    let ret = await Fetch(this.admins, {
      action: 'admin.login',
      account: m.account,
      password: m.password
    });
    this._sid = m.sid = ret.sid;
    return m;
  }

  // 管理员推出
  async adminExit(): Promise<void> {
    await Fetch(this.admins, {
      action: 'admin.exit',
      _sid: this._sid
    });
  }

  // 商户登录
  async merchantLogin(m: SdkMerchantLogin): Promise<SdkMerchantLogin> {
    let ret = await Fetch(this.merchants, {
      action: 'app.login',
      account: m.account,
      password: m.password,
      merchantid: m.merchantid
    });
    m.sid = ret.sid;
    return m;
  }

  // 商户验证
  async merchantVerify(m: SdkMerchantVerify): Promise<SdkMerchantInfo> {
    let ret = await Fetch(this.merchants, {
      action: 'app.info',
      _sid: m.sid
    });
    return Decode(new SdkMerchantInfo(), ret.info);
  }

  static shared = new Sdks();
}
