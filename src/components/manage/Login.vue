<template>
  <div class="login_page flex-center-container">
    <div class="form_contianer">
      <div class="manage_tip">
        后台管理系统
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">

import {Application} from "../../nnt/core/Application";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
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
    submitForm(formName) {
      this.$refs[formName].validate(res => {
        if (res) {
          Application.shared.push('/manage/main')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_page {
    width: 100%;
    height: 100%;
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
