<template>
  <div>{{message}}</div>
</template>

<script lang="ts">

import {Storage} from "../core/Storage";
import {Application, IRoute} from "../core/Application";

const KEY_CURRENT_SITE = '::nnt::vue::sites::current'

// 当前站点已经加载
let SITE_LOADED = false

export default {
  name: 'Site',
  inject: ['reload'],
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    if (SITE_LOADED)
      return
    SITE_LOADED = true

    // 通过url传递
    let site = this.$route.params.site
    if (!site)
      site = Storage.shared.value(KEY_CURRENT_SITE)

    // 查询一下site是否存在
    let sites = Application.shared.router.sites
    if (!(site in sites)) {
      // 从storage加载，放置二次重入带来的二级路径被踢掉
      site = Storage.shared.value(KEY_CURRENT_SITE)
      if (!(site in sites)) {
        // 读取默认的
        site = 'default'
        if (!(site in sites)) {
          this.message = '404 SITE NOT AVALIABLE'
          return
        }
      }
    }

    // 设置为当前
    Storage.shared.set(KEY_CURRENT_SITE, site)

    // 加载该站点的router
    sites[site]().then(obj => {
      let routes: IRoute[] = obj.default.routes

      // 刷新app中使用的路由
      Application.shared.flushRouter(obj.default);

      // 删除掉当前route中包含site的部分再跳转
      let path = this.$route.path
      path = path.replace('/' + site, '')
      if (path == '')
        path = '/'

      // 跳转到首页面
      Application.shared.push(path)
    })
  }
}
</script>
