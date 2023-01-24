<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:&nbsp;&nbsp;</span>
          <!-- 选择商品分类区域的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleCateClick">
        <!-- 添加动态参数的属性 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            class="cat_btn"
            type="primary"
            size="mini"
            :disabled="selectedCateKeys.length === 0"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数的表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(value, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ value }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态参数的属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            class="cat_btn"
            type="primary"
            size="mini"
            :disabled="selectedCateKeys.length === 0"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性的表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  closable
                  v-for="(value, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleClose(index, scope.row)"
                >
                  {{ value }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加对话框区域 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框区域 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框双向绑定到的数据
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加对话框的表单数据
      addForm: {
        attr_name: "",
      },
      // 添加对话框表单的验证规则
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑对话框的表单数据
      editForm: {},
      // 编辑对话框的表单验证
      editFormRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      
    };
  },
  methods: {
    // 获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get("/categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.cateList = res.data;
      //   console.log(res);
    },
    // 级联选择框选中项发生变化，会触发这个函数
    handleChange() {
      this.getParamsList();
    },
    // tab页签点击事件的处理函数
    handleCateClick() {
      console.log(this.activeName);
      this.getParamsList();
    },
    // 获取参数的列表数据
    async getParamsList() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return;
      }
      // console.log(this.selectedCateKeys);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res.data);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制按钮与文本框的切换
        item.inputVisible = false,
        // 文本框中输入的内容
        item.inputValue = ''
      });
      // console.log(res.data);
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 关闭添加对话框重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsList();
      });
    },
    // 点击按钮， 展示编辑对话框
    async showEditDialog(result) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${result.attr_id}`,
        { params: { attr_sel: result.attr_sel } }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取数据失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 关闭编辑对话框，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改数据失败");
        this.$message.success("修改数据成功");
        this.getParamsList();
        this.editDialogVisible = false;
      });
    },
    // 删除数据
    async deleteDialog(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除数据");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除数据失败");
      this.getParamsList();
      this.$message.success("删除数据成功");
    },
    // 按下enter或失去焦点后触发
    handleInputConfirm(row) {
      // 失去焦点后输入框隐藏
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入了内容，要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // 自动获取输入框焦点
      // $nextTick的作用是等页面重新渲染完之后，在调用里面的回调
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 对attr_vals的操作 保存到数据库
    async saveAttrVals(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('修改数据失败')
      return this.$message.success('修改数据成功')
    },
    // 删除对应的参数选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.cat_btn {
  margin-bottom: 10px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
.button-new-tag {
  color: #666 !important;
}
/deep/.el-table__cell {
  padding:12px 0 12px 20px;
}
</style>