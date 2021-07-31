<template>
  <!-- 在vue中统一加上了.sync来表示同步的修改了visible的值。 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <!-- 部门名称 -->
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <!-- 部门编码 -->
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <!-- 部门负责人 -->
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%">
          <el-option v-for="item in employeeList" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <!-- 部门介绍 -->
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">取 消</el-button>
      <el-button type="primary" @click="btnOK">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    treeNode: {
      type: Object,
      required: true // 必传
    }
  },
  data() {
    // 检查部门id  判断是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      console.log(value)
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }

    // 检查部门编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // console.log(value)
      const { depts } = await getDepartments()
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }

    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        code: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { max: 50, message: '编码必须在50个字符以内', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        introduce: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { max: 300, message: '介绍必须在300个字符以内', trigger: 'blur' }
        ],
        manager: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { max: 50, message: '名称必须在50个字符以内', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ]
      },
      employeeList: [] // 为子选项
    }
  },
  // 判断是否有formdata里面有没有id
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    //   获取员工列表数据
    async getEmployeeSimple() {
      this.employeeList = await getEmployeeSimple()
      // console.log(1)
      console.log(this.employeeList)
    },
    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      console.log(this.formData)
    },
    //   取消按钮   // 表单取消重置
    btnCancel() {
      // 清理表单数据
      // 得手动才保险
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      //    清理校验结果
      // 饿了么的表单方法可以清空表单绑定了的字段(额外添加的就没法清理啦, 不太用得上)
      // 还会清空表单报错提示
      this.$refs.addEmployee.resetFields()
      // 关闭弹窗
      // 可以用 update:变量名, 直接更新父组件的数据
      this.$emit('update:showDialog', false)
      // 更新页面
      this.$emit('addDepartment')
    },
    // 确认按钮
    async btnOK() {
      console.log(1)
      // 校验表单
      await this.$refs.addEmployee.validate()
      // 如果有id那就是编辑部门
      if (this.formData.id) {
        console.log(this.formData.id)
        await updateDepartments(this.formData)
      } else {
        // 新增
        // 表单数据缺少一个 pid 需要在发送前添加
        // console.log(this.treeNode.id)
        // 根id为''
        const pid = this.treeNode.id ? this.treeNode.id : ''
        await addDepartments({ ...this.formData, pid })
      }

      // 提示用户
      this.$message.success('操作成功')
      // 关闭弹窗 不能直接修改
      // this.showDialog = false
      // 可以用 update:变量名, 直接更新父组件的数据
      this.$emit('update:showDialog', false)
      // 更新页面
      this.$emit('addDepartment')
      // console.log(this.formData)
    }
  }
}
</script>

<style></style>
