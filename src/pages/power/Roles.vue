<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bottom', i1 === 0 ? 'top' : '']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRights(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'top']"
                >
                  <el-col :span="4">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRights(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRights(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹出框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="rolesDialogClosed"
      >
        <el-form
          :model="addRolesForm"
          :rules="addRolesFormRules"
          ref="addRolesFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑弹出框 -->
      <el-dialog
        title="修改角色信息"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form
          :model="editRolesForm"
          :rules="editRolesFormRules"
          ref="editRolesFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹出框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClosed"
      >
      <!-- 展示树型数据 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 存储角色列表
      rolesList: [],
      // 控制添加角色弹出框的隐藏与显示
      addDialogVisible: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 控制编辑角色弹出框的隐藏与显示
      editDialogVisible: false,
      editRolesForm: [],
      editRolesFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 控制分配权限对话框的现实与隐藏
      setRightsDialogVisible: false,
      // 获取到的权限数据存储的地方
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配权限的id值
      roleId: '',
    };
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");
      //   console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
    },
    // 关闭添加角色框后重置
    rolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },
    // 对添加角色表单进行预验证并提交到后台
    addRoles() {
      // 预验证
      this.$refs.addRolesFormRef.validate(async (vaild) => {
        if (!vaild) return;
        // 提交到后台
        const { data: res } = await this.$http.post("/roles", this.rolesForm);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        // 请求成功后的处理
        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 展示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("/roles/" + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editRolesForm = res.data;
      this.editDialogVisible = true;
    },
    // 对编辑表单进行预验证并提交到后台
    editRoles() {
      this.$refs.editRolesFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          "/roles/" + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        // 提交成功
        this.$message.success("修改成功");
        this.editDialogVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色
    deleteRolesById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/roles/" + id);
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.getRolesList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 根据id移除用户的权限
    async removeRights(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      // 删除后台对应权限
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      );
      // console.log(res.data);
      // console.log(role);
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      role.children = res.data;
      this.$message.success("删除权限成功");
    },
    // 展示分配角色对话框
    async showSetRightsDialog(role){
      this.roleId = role.id
      const {data: res} = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到delKeys 数组中
    getLeafKeys(node, arr) {
      // 若当前的node节点不包含children则是三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 监听分配权限对话框的关闭时间 
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 为当前角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      const keysStr = keys.join(',')
      const {data:res} = await this.$http.post(`/roles/${this.roleId}/rights`, {rids: keysStr})
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  },
  mounted() {
    this.getRolesList();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.bottom {
  border-bottom: 1px solid #eee;
}
.top {
  border-top: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>