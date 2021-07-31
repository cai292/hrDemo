<template>
  <!-- 公司角色设置 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                :disabled="!checkPermission('addRote')"
                @click="addRole"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->

            <el-table :data="list" style="width: 100%">
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="name" label="角色名" sortable />
              <el-table-column prop="description" label="描述" sortable />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" :disabled="!checkPermission('editRote')" @click="updataRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :current-page="page.page"
                :page-size="page.pagesize"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区等公司资料不能修改！！！"
              type="info"
              show-icon
              :closable="false"
              style="margin-bottom:30px"
            />
            <!-- 表单 -->
            <el-form ref="form" label-width="80px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled style="width:400px" type="textarea" :rows="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="roleForm.id?'编辑角色':'添加角色'"
      :visible.sync="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form ref="roleformRef" :model="roleForm">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOK">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showPermDialog"
      width="50%"
      @close="btnPermCancel"
    >
      <!-- 树形结构 -->
      <el-tree
        ref="permTree"
        :data="permData"
        node-key="id"
        show-checkbox
        check-strictly
        default-expand-all
        :default-checked-keys="selectCheck"
        :props="defaultProps"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnPermCancel">取 消</el-button>
        <el-button type="primary" @click="btnPermOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 列表数据
      page: {
        page: 1,
        pagesize: 10,
        total: 0// 记录总数
      },
      formData: {
        name: '广州市朝睿有限公司',
        companyAddress: '广州天河区厚和大厦',
        companyPhone: '400-111-1212',
        mailbox: '12345678@qq.com',
        remarks: '互联网公司'

      }, // 公司信息
      roleForm: {
        name: '',
        description: ''
      }, // 角色表单
      rulus: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      showDialog: false,
      showPermDialog: false,
      permData: [], // 权限数据
      defaultProps: {
        label: 'name'
      }, // 对应的数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null
    }
  },

  // 计算机属性
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    // this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // checkPermission(point) {
    //   return this.$store.state.user.userInfo.roles.points.includes(point)
    // },
    // checkPermission(point) {
    //   // 找到就是为true，否则就是为false
    //   return this.$store.state.user.userInfo.roles.points.includes(point)
    // },
    // 点击分配权限
    async assignPerm(id) {
      // 拿到所有权限点
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id)// permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      // 存储单前id  等下点击确认用到
      this.roleId = id
      // console.log(this.selectCheck)
      // console.log(this.permData)
      this.showPermDialog = true
    },
    // 角色列表数据
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      console.log(this.list)
    },
    // 新增角色
    addRole() {
      this.showDialog = true
    },
    // 页面改变
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      console.log(this.formData)
    },
    // 点击删除权限
    async  deleteRole(id) {
      // console.log(id)
      const confirmRemove = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRemove)
      if (confirmRemove !== 'confirm') return this.$message.info('用户取消删除')
      // 发送请求
      await deleteRole(id)
      this.$message.success('删除角色成功')
      //  刷新页面
      this.getRoleList()
    },
    // 编辑角色
    async updataRole(id) {
      // console.log(id)
      // 打开模态框
      this.showDialog = true
      //  拿到用户详情
      this.roleForm = await getRoleDetail(id)
      // console.log(this.roleForm)
    },
    // 点击编辑取消按钮或者模态框关闭是  表单清空
    async btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 表单清空
      this.$refs.roleformRef.resetFields()
      this.showDialog = false
    },
    // 点击编辑确认按钮
    btnOK() {
      // console.log(this.roleForm.id)
      this.$refs.roleformRef.validate(async val => {
        if (!val) return this.$message.error('表单验证失败')
        if (this.roleForm.id) {
          // 编辑按钮
          await updateRole(this.roleForm)
        } else {
          // 添加按钮
          await addRole(this.roleForm)
        }
        this.$message.success('操作成功')
        // 刷新数据
        this.getRoleList()
        this.showDialog = false
      })
    },
    // 点击添加权限的取消
    btnPermCancel() {
      // console.log(1)
      this.selectCheck = []// 重置数据
      this.showPermDialog = false
    },
    async btnPermOK() {
      // console.log(2)
      // 调用el-tree的方法
      // getCheckedKeys返回目前被选中的节点的 key 所组成的数组
      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    }
  }

}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  padding: 40px;

}

</style>
