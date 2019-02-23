<template>
  <div class="login_page flex-center-container">
    <div class="form_contianer">
      <div class="manage_tip">
        后台管理系统
      </div>
      <el-form :model="mlogin" :rules="rlogin" ref="login">
        <el-form-item prop="username">
          <erp-input v-model="mlogin.username" placeholder="用户名"><span></span></erp-input>
        </el-form-item>
        <el-form-item prop="password">
          <erp-input type="password" placeholder="密码" v-model="mlogin.password"></erp-input>
        </el-form-item>
        <el-form-item>
          <erp-button type="primary" @click="actLogin()" class="submit_btn">登录</erp-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">

import {Application} from "../../nnt/core/Application";
import ErpButton from "../../nnt/erp/widgets/base/Button.vue";
import ErpInput from "../../nnt/erp/widgets/base/Input.vue";

export default {
  name: "Login",
  components: {ErpInput, ErpButton},
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
    actLogin() {
      alert(this.mlogin.username)
      this.$refs.login.validate(res => {
        if (!res)
          return
        Application.shared.push('/manage/main')
      })
    }
  }
}
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
