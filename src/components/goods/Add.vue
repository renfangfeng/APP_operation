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
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon:closable = 'false'></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
         <el-step title="基本信息"></el-step>
         <el-step title="商品参数"></el-step>
         <el-step title="商品属性"></el-step>
         <el-step title="商品图片"></el-step>
         <el-step title="商品内容"></el-step>
         <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
       <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave = 'beforTabLeave'  @tab-click = 'tabClicked'>
         <!-- 基本信息 -->
             <el-tab-pane label="基本信息" name="0">
               <el-form-item label="商品名称" prop="goods_name">
                 <el-input v-model="addForm.goods_name"></el-input>
               </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                 <el-input v-model="addForm.goods_price" type="number"></el-input>
               </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                 <el-input v-model="addForm.goods_weight" type="number"></el-input>
               </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                 <el-input v-model="addForm.goods_number" type="number"></el-input>
               </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                 <el-cascader clearable v-model="addForm.goods_cat" type="number"
                 expand-trigger="hover" :options="catelist" :props="createProps" @change="handleChange">
                 </el-cascader>
               </el-form-item>
             </el-tab-pane>
             <!-- 商品参数 -->
            <el-tab-pane label="商品参数" name="1">
              <!-- 复选框组 -->
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                      <el-checkbox-group v-model="item.attr_vals">
                          <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals1" :key="i" border></el-checkbox>
                      </el-checkbox-group>
               </el-form-item>
            </el-tab-pane>
            <!-- 商品属性 -->
            <el-tab-pane label="商品属性" name="2">
               <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                 <el-input v-model="item.attr_vals"></el-input>
               </el-form-item>
            </el-tab-pane>
            <!-- 商品图片 -->
            <el-tab-pane label="商品图片" name="3">
                    <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview"
                        :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                       <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
            </el-tab-pane>
            <!-- 商品内容 -->
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
       </el-tabs>
       </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync ='previewVisible'>
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
</div>
</template>

<script>
export default {
  name: 'add',
  data () {
    return {
      activeIndex: 0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []

      },
      // 商品分类列表
      catelist: [],
      createProps: {
        label: 'cat_name',
        value: 'cat_id',
        chirdren: 'chirdren'
      },
      // 动态数据参数列表
      manyTableData: [],
      onlyTableData: [],
      previewPath: '',
      previewVisible: false,
      // 上传的图片地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // headerObj
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 基本信息验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }

        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }

        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.catelist = res.data
    },
    // 联级选择器变化会触发这个函数
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforTabLeave (activeName, oldDctiveName) {
      if (oldDctiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 切换tab框触发事件
    async tabClicked () {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          item.attr_vals1 = [...item.attr_vals]
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        this.onlyTableData = res.data
      }
    },
    // 处理图片的预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除照片的操作
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品按钮
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态数据
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态数据
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        console.log(this.addForm)
        const { data: res } = await this.$http.post('goods', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  // 计算属性
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
.previewImg{
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 !important;
}
</style>
