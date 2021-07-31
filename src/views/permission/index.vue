<template>
  <!-- 权限管理 -->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <!-- 组件 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table ref="myTable" :data="list" border stripe row-key="id" default-expand-all>
        <el-table-column prop="name" label="菜单名称" align="center">
          <template slot-scope="scope">
            <span class="pointer" @click="rowArr(scope.row)">
              <i v-if="scope.row.type==1" class="el-icon-folder-opened" />
              <i v-else class="el-icon-view" /> {{ scope.row.name }}</span>

          </template>
        </el-table-column>
        <el-table-column prop="code" label="权限标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(row.id, 2)">添加权限点</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <el-form ref="formRef" :model="formData" label-width="80px">
        <el-form-item label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="企业可见">

          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, getPermissionDetail, delPermission, addPermission, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      showDialog: false
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取所有权限点
    async getPermissionList() {
      // 当前的pid为0是跟级
      this.list = tranListToTreeData(await getPermissionList(), '0')
      // const res = await getPermissionList()
      // console.log(res)
      // this.list = res
      console.log(this.list)
    },
    // 添加权限
    addPermission(id, type) {
      // console.log(1)
      // console.log(id)
      // 根级的pid为字符串'0'
      // 添加单前的id
      this.formData.pid = id
      // id ? this.formData.pid = id : this.formData.pid = '0'
      // console.log(this.formData.pid)
      // 添加type
      this.formData.type = type
      this.showDialog = true
    },
    // 点击取消
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.$refs.formRef.resetFields()
      this.showDialog = false
    },
    // 点击确认按钮
    btnOK() {
      // 表单校验
      this.$refs.formRef.validate(async val => {
        if (!val) return this.$message.error('表单校验失败')
        // 编辑
        if (this.formData.id) {
          await updatePermission(this.formData)
          this.$message.success('编辑成功')
        } else {
          // 添加
          await addPermission(this.formData)
          this.$message.success('新增成功')
        }

        this.getPermissionList()
        this.showDialog = false
      })
    },
    // 编辑权限
    async  editPermission(id) {
      // console.log(id)
      // 根据id拿到数据
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除权限
    async  delPermission(id) {
      console.log(id)
      const removeconfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(removeconfirm)
      if (removeconfirm === 'cancel') return this.$message.info('用户取消删除')
      await delPermission(id)
      this.$message.success('删除成功')
      this.getPermissionList()
    },
    // 控制表格的来回切换
    rowArr(row) {
      this.$refs.myTable.toggleRowExpansion(row)
    }

  }
}
</script>
<style lang="scss" scoped>
.pointer{
  cursor: pointer;
}
</style>

