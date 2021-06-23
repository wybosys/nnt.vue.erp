<template>
  <div class="login_page flex-center-container">
    <div class="form_contianer">
      <div class="manage_tip">
        后台管理系统
      </div>
      <erp-form :model="mlogin" :rules="rlogin" ref="login">
        <erp-form-item prop="username">
          <erp-input v-model="mlogin.username" placeholder="用户名"><span></span></erp-input>
        </erp-form-item>
        <erp-form-item prop="password">
          <erp-input type="password" placeholder="密码" v-model="mlogin.password"></erp-input>
        </erp-form-item>
        <erp-form-item>
          <erp-button type="primary" @click="actLogin()" class="submit_btn">登录</erp-button>
        </erp-form-item>
      </erp-form>
    </div>
  </div>
</template>

<script lang="ts">

import {Application} from "../nnt/core/Application";
import {TestClient} from "../api/logic-grpc/dubbo/TestServiceClientPb";
import {ReqTestEcho} from "../api/logic-grpc/dubbo/test_pb";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      mlogin: {
        username: '',
        password: '',
      },
      rlogin: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    async actLogin() {
      await this.$refs.login.validate()
      Application.shared.push('/main')
    }
  }
}

// 测试grpc接口访问，服务通过 github.com/wybosys/nnt.logic.jvm 提供支持
let cli = new TestClient('http://localhost:8094', null, null)
let req = new ReqTestEcho()
req.setInput(new Date().toDateString())
cli.echo(req, null).then(resp=>{
  console.info(resp.getOutput())
})

</script>

<style lang="scss" scoped>
  .login_page {
    height: 100vh;
    background-color: $color-base;
  }

  .form_contianer {
    width: 400px;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff

  }

  .manage_tip {
    font: 30px/50px 'Microsoft YaHei UI';
    padding-bottom: 20px;
  }

</style>
