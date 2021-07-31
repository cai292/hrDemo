<template>
  <div v-loading="loading">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->

      <treeTools :tree-node="company" :is-root="true" @addDepartment="addDepartment" />
      <!-- 树形结构 -->
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true" :expand-on-click-node="false">
        <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
        <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->

        <template slot-scope="scope">
          <treeTools :tree-node="scope.data" @delDepartment="getDepartments" @addDepartment="addDepartment" @editDepartment="editDepartment" />
        </template>
      </el-tree>
    </el-card>
    <!-- 弹窗 -->
    <addDept ref="addDept" :tree-node="treeNode" :show-dialog.sync="showDialog" @addDepartment="getDepartments" />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import treeTools from './components/tree-tools.vue'
import { tranListToTreeData } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  components: {
    treeTools,
    addDept
  },
  data() {
    return {
      company: {}, // 头部的
      departs: [],
      showDialog: false, // 显示窗体
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeNode: {}, // 赋值操作的节点
      loading: false // loading
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 拿到数据
    async getDepartments() {
      this.loading = true
      //  因为在响应拦截器已经都结构了
      // 组织的数据
      const res = await getDepartments()
      // console.log(res)
      // 头部
      this.company = { name: '广州市朝睿有限公司', manager: '负责人', id: '' }
      // this.departs = res.depts // 需要将其转化成树形结构
      // 这里定义一个空串  因为 它是根 所有的子节点的数据pid 都是 ""
      this.departs = tranListToTreeData(res.depts, '')
      // console.log(this.departs)
      this.loading = false
    },
    // 添加数据
    addDepartment(node) {
      console.log(node)
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.treeNode = node
    },
    // 编辑数据
    editDepartment(node) {
      console.log(node)

      this.treeNode = node
      // 通过$ref调用子组件的值  // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
      // 打开模态框
      this.showDialog = true
    }
  }
}
</script>
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
