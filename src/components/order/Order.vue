<template>
<div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span = '8'>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格数据 -->
        <el-table :data ='orderlist' border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" >
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" >
          <template slot-scope="scope">
              {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
           <template slot-scope="scope">
            <template>
              {{ scope.row.create_time | dataFilter }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px">
          <template>
            <el-button type="primay" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <el-button type="danger" icon="el-icon-location" size="mini" @click="showProgressBox" ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
      :page-sizes="[1,2,3,4]" :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改地址" :visible.sync="addresVisible" width="50%" @close='addressDialogClosed'>
       <!-- 表单区域 -->
       <el-form :rules="addressFormRules" :model="addressForm" label-width="80px" ref="addressFormRef">
          <el-form-item label="省市县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
           <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
       <el-button @click="addresVisible = false">取 消</el-button>
       <el-button type="primary" @click="addresVisible = false">确 定</el-button>
       </span>
</el-dialog>

<!-- 物流对话框 -->
 <el-dialog title="物流对话框" :visible.sync="progressVisible" width="50%">
       <!-- 表单区域 -->
       <span>1111</span>
</el-dialog>
</div>
</template>

<script>
import cityData from './citydata'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addresVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 表单验证
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    // 监听 handleSizeChange
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderlist()
    },
    // 监听handleCurrentChange
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderlist()
    },
    // 展示修改地址对话框
    showEditDialog () {
      this.addresVisible = true
    },
    // 重置对话框
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流消息对话框
    async showProgressBox () {
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败')
      // }
      // this.progressInfo = res.data
      this.progressVisible = true
    }

  },
  computed: {

  }
}
</script>

<style scoped>

</style>
