import App from './App.vue'
import router from './router'
import {SampleLoginsdk, SampleLoginverifysdk} from "./api/framework-nntlogic-apis";
import {Get} from "./nnt/core/RestSession";
import {Application} from "./nnt/core/Application";

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Application({
  app: App,
  router: router
}).start()

declare let sdks: any
if (typeof sdks != "undefined") {
  sdks.config.set('CHANNEL_ID', 1804)
  sdks.config.set('GAME_ID', 100)
  sdks.init().then(() => {
    console.info("SDKS 初始化成功")
    // 使用sdk的用户登录
    sdks.userDetailInfo().then(info => {
      let lg = SampleLoginsdk();
      lg.raw = info.raw;
      lg.channel = info.channel;
      Get(lg).then(() => {
        let lv = SampleLoginverifysdk();
        lv.sid = lg.sid;
        Get(lv).then(() => {
          console.log("登录成功 " + lv.user.uid);
        });
      });
    });
  });
}
