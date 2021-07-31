<template>

  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  async  created() {
    const { rows } = await getRoleList()
    this.list = rows
    // console.log(this.list)
  },
  methods: {
    //   用户的基本信息
    async getUserDetailById(id) {
    //   console.log(id)
      const { roleIds } = await getUserDetailById(id)
      // 选中id
      this.roleIds = roleIds// 赋值本用户的角色

      // console.log(this.roleIds)
    },
    // 模态框取消
    btnCancel() {
      // 清空
      // console.log(1)
      this.roleIds = []

      this.$emit('update:showRoleDialog', false)
    },
    // 点击ok
    async btnOK() {
      // console.log(1)
      await assignRoles({ id: this.userId, roleIds: this.roleIds })

      this.$emit('update:showRoleDialog', false)
    }

  }
}
</script>

