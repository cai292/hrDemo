<template>
  <div>
    <!-- 新增员工功能 -->
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="50%"
      @close="btnCancel"
    >
      <!-- form表单 -->
      <el-form ref="formDataRef" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="formData.mobile" />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-col>
            <el-date-picker v-model="formData.timeOfEntry" type="date" placeholder="选择日期" style="width: 50%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="formData.formOfEmployment" placeholder="请选择" style="width: 50%;">
            <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="formData.workNumber" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
          <!-- 树形结构 -->
          <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="{ label: 'name' }" default-expand-all @node-click="selectNode" />

        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-col>
            <el-date-picker v-model="formData.correctionTime" type="date" placeholder="选择日期" style="width: 50%;" />
          </el-col>
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
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, // 枚举的数据
      formData: {
        username: '',
        mobile: '13112113333',
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: ''// 转正时间
      }, // 表单数据
      // 表单的验证
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间时间不能为空', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间时间不能为空', trigger: 'blur' }]
      },
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示与隐藏
      loading: false // 控制树的显示或者隐藏进度条
    }
  },

  methods: {
    // 拿到树形  部门数据
    async getDepartments() {
      this.showTree = true
      this.loading = true

      const { depts } = await getDepartments()
      console.log(depts)
      // depts是数组 但不是树形
      this.treeData = tranListToTreeData(depts, '')
      console.log(this.treeData)
      this.loading = false
    },
    // 部门被点击时
    selectNode(node) {
      // console.log(1)
      // console.log(node)
      this.formData.departmentName = node.name// 将数据放到表单中
      this.showTree = false
    },
    // 点击取消按钮或关闭模态框
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: ''// 转正时间
      }
      this.$refs.formDataRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    btnOK() {
      // 点击确定按钮
      this.$refs.formDataRef.validate(async val => {
        if (!val) return this.$message.error('表单验证失败')
        await addEmployee(this.formData)
        this.$message.success('添加成功')
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        this.$parent.getEmployeeList()
        this.$emit('update:showDialog', false)
      })
    }

  }
}
</script>

<style>

</style>
