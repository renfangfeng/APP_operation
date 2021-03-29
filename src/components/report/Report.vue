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
      <div id="main" style="width:750px;height:400px;"></div>
    </el-card>
</div>
</template>

<script>
import Loadhs from 'lodash'
const echar = require('echarts')
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  async mounted () {
    // 初始化echarts实例
    const myChart = echar.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    const result = Loadhs.merge(res.data, this.options)
    // 展示数据
    myChart.setOption(result)
  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>

</style>
