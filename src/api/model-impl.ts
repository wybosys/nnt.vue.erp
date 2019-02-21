import {Base} from "../nnt/Logic";
import {config} from "../nnt/Config";

export class Model extends Base {

  constructor() {
    super();
    this.host = config.get('HOST');
    this.withCredentials = false;
  }

  iscross(): boolean {
    return false;
  }

  domain: string;

  url(): string {
    if (config.get('LOCAL'))
      return this.host + "?action=" + this.action;
    return this.host + this.domain + "/?action=" + this.action;
  }
}
