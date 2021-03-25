<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录区域 -->
      <el-form ref="loginFormRef" class="login_form" label-width="0px" :rules="rules" :model="loginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model = 'loginForm.username' ></el-input>
        </el-form-item>
        <!-- 密码框 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model = 'loginForm.password'></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" >登录</el-button>
          <el-button type="info"  @click="loginFormRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: 123456
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormRef () {
      // 重置表单
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        // 登录成功之后把tokent  保存在客户端的sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  },
  computed: {}
}
</script>

<style lang = "less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  height: 300px;
  background-color: #ffff;
  transform: translate(-50%, -50%);
}
.login_box .login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_box .btns {
  display: flex;
  justify-content: flex-end;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
