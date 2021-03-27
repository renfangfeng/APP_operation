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
      <el-alert  title="注意：只允许为第三级分类设置相关参数！" type="warning" center show-icon > </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader  v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
       <!-- tab页签区域 -->
        <el-tabs v-model="activeName" @tab-click="handleTabChange">
           <el-tab-pane label="动态参数" name="many">
             <!-- 添加参数按钮 -->
             <el-button type="primary" size="mini" :disabled='isBtnDisabled'  @click="addDialogVisible = true">添加参数</el-button>
             <!-- 动态参数表格 -->
             <el-table :data="manyTableData" border stripe>
               <!-- 展开列 -->
               <el-table-column type="expand">
                 <template slot-scope="scope">
                   <!-- 循环渲染TAG标签 -->
                   <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="removeTag(i,scope.row)">{{item}}</el-tag>
                   <!-- 输入文本框 -->
                   <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)"  @blur="handleInputConfirm(scope.row)">
                   </el-input>
                   <!-- 添加按钮 -->
                   <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
               </el-table-column>
               <!-- 索引列 -->
               <el-table-column type="index"></el-table-column>
               <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                 <template slot-scope="scope">
                 <el-button size="mini" type="primary" icon="el-cion-edit"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                 <el-button size="mini" type="danger" icon="el-cion-delete" @click="removeUserById(scope.row.attr_id)">删除</el-button>
               </template>

               </el-table-column>

             </el-table>
           </el-tab-pane>

           <el-tab-pane label="静态属性" name="only">
             <!-- 添加属性按钮 -->
             <el-button type="primary" size="mini" :disabled='isBtnDisabled'  @click="addDialogVisible = true">添加属性</el-button>
             <!-- 静态参数表格 -->
             <el-table :data="onlyTabeData" border stripe>
               <!-- 展开列 -->
                 <el-table-column type="expand">
                 <template slot-scope="scope">
                   <!-- 循环渲染TAG标签 -->
                   <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable >{{item}}</el-tag>
                   <!-- 输入文本框 -->
                   <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)"  @blur="handleInputConfirm(scope.row)">
                   </el-input>
                   <!-- 添加按钮 -->
                   <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                 </template>
               </el-table-column>
               <!-- 索引列 -->
               <el-table-column type="index"></el-table-column>
               <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">

                 <template slot-scope="scope">
                 <el-button size="mini" type="primary" icon="el-cion-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                 <el-button size="mini" type="danger" icon="el-cion-delete"  @click="removeUserById(scope.row.attr_id)">删除</el-button>
               </template>
               </el-table-column>

             </el-table>
           </el-tab-pane>
       </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="30%"  @close = "addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑对话框 -->
     <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
      <el-form  label-width="100px" :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态参数的数据
      onlyTabeData: [],
      // 控制添加属性对话框的显示和隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示和隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {},
      // 修改表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制按钮与文本框的切换显示
      inputVisible: false,
      // 文本框输入的内容
      inputValue: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    // 级联选择框选中变化
    async handleChange () {
      this.getParamsData()
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 证明选中的三级分类
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.$message.success('获取参数列表成功')
    },
    // tab页签点击事件处理函数
    handleTabChange () {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTabeData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 展示修改用户对话框
    async showEditDialog (arrtId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${arrtId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击修改框确定按钮 修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户删除成功')
      this.getParamsData()
    },
    // 文本框失去焦点或者摁下enter都会触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
      row.inputVisible = false
    },
    // 点击按钮 展示文本框
    showInput (row) {
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(() => { // 箭头函数无参数可以写()或者_
        this.$refs.saveTagInput.focus()
      })
    },
    // 删除添加的文本标签失败
    async removeTag (i, row) {
      const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      row.attr_vals.splice(i, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('用户删除成功')
      this.getParamsData()
    }
  },

  // 计算属性
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }

  }
}
</script>

<style scoped>
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
