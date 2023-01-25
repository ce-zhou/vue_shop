<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡品区域 -->
    <el-card>
      <!-- 输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProcess"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改地址"
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
        <el-form-item label="活动名称" prop="message1">
          <el-cascader v-model="editForm.message1" :options="citydata">
          </el-cascader>
        </el-form-item>
        <el-form-item label="活动名称" prop="message2">
          <el-input v-model="editForm.message2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流数据对话框 -->
    <el-dialog title="提示" :visible.sync="processVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in wuliu"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "./citydata"
import wuliu from './wuliu'
export default {
  name: "Order",
  data() {
    return {
      // 发送get请求的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 获取订单数据
      orderList: [],
      // 总数量
      total: 0,
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 表单绑定的数据
      editForm: {
        message1: [],
        message2: "",
      },
      // 编辑对话框表单验证规则
      editFormRules: {
        message1: [
          { required: true, message: "请选择省市县", trigger: "blur" },
        ],
        message2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      citydata,
      // 控制物流对话框的显示与隐藏
      processVisible: false,
      wuliu,
    };
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get("/orders", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取订单数据失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页条数发生改变时触发的函数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },
    // 页数发生改变时触发的函数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    // 点击按钮，显示编辑对话框
    showEditBox() {
      this.editDialogVisible = true;
    },
    // 关闭编辑对话框 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showProcess() {
      this.processVisible = true;
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>