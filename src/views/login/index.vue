<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 用户名 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.mobile" placeholder="Username" name="mobile" type="text" tabindex="1" auto-complete="on" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 如果用了封装组件的话，比如element，这个时候使用按键修饰符需要加上.native -->
        <!-- @keyup.enter.native="submit" -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="changeFn"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="loginBtn" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登 录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'Login',
  data() {
    // 校验名字
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
      // validMobile(value) ? callback() : callback(new Error('手机格式不正确'))
    }
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { trigger: 'blur', min: 6, max: 16, message: '密码的长度在6-16位之间' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['user/login']),
    ...mapMutations(['user/login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 键盘回车
    // submit(e) {
    //   console.log(e)
    //   console.log(1)
    //   this.handleLogin()
    // },
    // 键盘回车
    changeFn() {
      // console.log(1)
      this.handleLogin()
    },
    // 点击登录按钮
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        // 表单验证不过才提示
        if (!valid) {
          this.loading = true
          return this.$message.error('表单验证失败')
        }
        // 第一种
        await this.$store.dispatch('user/login', this.loginForm)
        // 第二种
        // this['user/login'](this.loginForm)
        this.$router.push('/')
        this.loading = false
        // if (valid) {
        //   this.loading = true
        //   this.$store
        //     .dispatch('user/login', this.loginForm)
        //     .then(() => {
        //       this.$router.push({ path: this.redirect || '/' })
        //       this.loading = false
        //     })
        //     .catch(() => {
        //       this.loading = false
        //     })
        // } else {
        //   console.log('error submit!!')
        //   return false
        // }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // 要加上~否则不识别
  background-image: url('~@/assets/common/login.jpg');
  background-position: center;
      background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      font-size: 18px;
      caret-color: $cursor;

      &:-webkit-autofill {
      transition-delay: 99999s;
    transition: color 99999s ease-out, background-color 99999s ease-out;
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    color: #454545;
    // 错误信息颜色
    .el-form-item__error {
      color: #fff;
      font-size: 16px;
    }
  }
  // 设置登录的样式
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
