<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpeg" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user1"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model.number="loginForm.password"
            prefix-icon="iconfont icon-password1"
            show-password
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 这是登陆表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 这是表单验证对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮后重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return;
        this.$http
          .post("/login", this.loginForm)
          .then((response) => {
            if (response.data.meta.status === 200) {
              this.$message.success(`${response.data.meta.msg}`);
              // 1、将登陆成功之后的token保存到客户端的 sessionStorage 中
              // 1.1、项目中除了登陆之外的其他API窗口必须在登陆之后才能访问
              // 1.2、token 只应在当前网站打开期间生效，所以将token保存在 sessionStorage中
              window.sessionStorage.setItem("token", response.data.data.token);
              // 2、通过编程式导航跳转到后台主页 路由地址是 /home
              this.$router.push("/home");
            } else {
              this.$message.error(`${response.data.meta.msg}`);
            }
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: url(../assets/bg.jpeg) no-repeat;
  background-size: cover;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 450px;
  background-color: rgba(255, 255, 255, 0.5);
  // opacity: 0.5;
  border-radius: 10px;
}
.avatar_box {
  width: 100px;
  height: 100px;
  margin: -10% auto;
  border: 1px solid #eee;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
/deep/.el-input {
  .el-input__inner {
    background-color: rgba(255, 255, 255, 0.6) !important;
  }
}

.btns {
  display: flex;
  justify-content: end;
}
</style>