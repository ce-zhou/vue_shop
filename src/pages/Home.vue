<template>
  <div>
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logOut() {
      // 清空token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>