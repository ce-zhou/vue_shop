<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 输入框和添加按钮区域 -->
      <el-row :gutter="20">
        <!-- input输入框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引行 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改商品对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%"
    @close="editDialogClosed">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEdit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 获取商品数据列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 控制修改商品对话框的显示与隐藏
      editDialogVisible: false,
      // 获取商品数据
      editForm: {},
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
      id: 0
    };
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("/goods", {
        params: this.queryInfo,
      });
      // console.log(res.data.goods);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品数据失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 改变每页条数时触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    // 改变当前页数时触发
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    // 删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(`/goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除商品失败");
      this.getGoodsList();
      this.$message.success("删除商品成功");
    },
    // 点击添加商品按钮， 跳转到添加商品页面
    goAddPage() {
      this.$router.push("/goods/add");
    },
    // 展示编辑对话框
    async editDialog(row) {
      const { data: res } = await this.$http.get(`/goods/${row.goods_id}`);
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.data);

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 重置编辑表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，对表单预验证并提交到后台
    async addEdit() {
      const {data: res} = await this.$http.put(`/goods/${this.editForm.goods_id}`, {
        goods_cat: this.editForm.goods_cat,
        goods_name: this.editForm.goods_name,
        goods_price: this.editForm.goods_price,
        goods_number: this.editForm.goods_number,
        goods_weight: this.editForm.goods_weight,
        goods_introduce: this.editForm.goods_introduce,
        pics: this.editForm.pics,
        attrs: this.editForm.attrs,

      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改数据失败')
      }
      this.$message.success('修改数据成功')
      this.getGoodsList()
      this.editDialogVisible = false
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>