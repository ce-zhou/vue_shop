<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#324157"
          text-color="#fff"
          active-text-color="#4097f6"
          :default-active="activeItem"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id.toString()"
            v-for="item in meauList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(`/${subItem.path}`)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <!-- 子组件占位-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      meauList: [],
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-wodedingdan0101",
        145: "iconfont icon-shuju",
      },
      // 是否折叠左侧菜单
      isCollapse: false,
      activeItem: ''
    };
  },
  methods: {
    logOut() {
      // 清空token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMeauList() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.meauList = res.data;
      // console.log(this.meauList);
    },
    // 对左侧菜单的折叠和展开的切换
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存激活菜单的index
    saveNavState(activeItem){
      window.sessionStorage.setItem('activeItem', activeItem)
      this.activeItem = activeItem
    }
  },
  created() {
    this.getMeauList();
    this.activeItem = window.sessionStorage.getItem('activeItem')
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #242e42;
  padding-left: 0;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #324157;
  .toggle_button {
    background-color: #485164;
    font-size: 10px;
    color: #fff;
    text-align: center;
    line-height: 21px;
    letter-spacing: 2px;
    cursor: pointer;
  }
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #fff;
}
.iconfont {
  margin-right: 10px;
}
</style>