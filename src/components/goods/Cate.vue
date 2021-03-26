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
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data ='catelist' :columns='columns' :selection-type = "false" :expand-type="false">
        <template slot="cat_deleted" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序列表 -->
        <template slot="cat_level" slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="danger" v-else>三级</el-tag>
        </template>
        <!-- 操作列表 -->
        <template slot="opt" >
          <el-button type="primary" size=" mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size=" mini" icon="el-icon-delete"></el-button>
          <el-button type="warning" size=" mini" icon="el-icon-setting"></el-button>

        </template>
      </tree-table>
      <!-- 分页区域 -->

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum"
      :page-sizes="[1,2,3,4]" :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="showAddCateVisible" width="30%" @close = 'addCateDialogClosed'>
    <!-- 添加分类的表单 -->
    <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
       <el-form-item label="分类名称" prop="cat_name">
       <el-input v-model="addCateForm.cat_name"></el-input>
       </el-form-item>

       <el-form-item label="父级分类">
          <el-cascader clearable  change-on-select v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged"></el-cascader>
       </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
    <el-button @click="showAddCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      catelist: [],
      showAddCateVisible: false,
      total: 0,
      // 添加分类的表单数据
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父类分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的1级分类
        cat_level: 0
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 添加表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, $message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisble: false,
      // 为table指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', prop: 'cat_deleted', type: 'template', template: 'cat_deleted' },
        { label: '排序', prop: 'cat_level', type: 'template', template: 'cat_level' },
        { label: '操作', type: 'template', template: 'opt' }

      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮 展示添加分类对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.showAddCateVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发的函数
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮 添加新的分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.showAddCateVisible = false
      })
    },
    // 监听对话框关闭事件 重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
