<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown>
            <!-- 下拉菜单 -->
            <span class="el-dropdown-link"> 操作<i class="el-icon-arrow-down el-icon--right" /> </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addDepartment">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" @click.native="editDepartment">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" @click.native="delDepartment">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  props: {
    treeNode: {
      type: Object,
      required: true // 必传
    },
    isRoot: {
      type: Boolean,
      default: false // 默认值
    }
  },
  methods: {
    // 删除功能
    async delDepartment() {
      try {
        // 二次验证
        await this.$confirm('是否确认删除')
        // 发送请求
        await delDepartments(this.treeNode.id)
        // 提示用户
        this.$message.success('删除成功')
        // 通知父组件更新
        this.$emit('delDepartment')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加功能
    addDepartment() {
      console.log(1)
      this.$emit('addDepartment', this.treeNode)
    },
    // 点击编辑功能、
    editDepartment() {
      this.$emit('editDepartment', this.treeNode)
    }
  }
}
</script>

<style></style>
