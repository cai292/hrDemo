<template>
  <!-- 离职对话框 -->
  <el-dialog
    title="申请"
    :visible="showDialog"
    width="50%"
    @close="btnCancel"
  >
    <!-- 离职 -->
    <el-form
      v-if="ruleForm.processName==='离职'"
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      label-width="110px"
      :rules="rules"
    >
      <el-form-item label="申请类型">
        <el-select v-model="ruleForm.processName" placeholder="请选择活动区域" style="width: 50%;">
          <el-option v-for="item in process" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="期望离职时间" prop="exceptTime">
        <el-date-picker v-model="ruleForm.exceptTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 50%;" />
      </el-form-item>
      <el-form-item label="离职原因" prop="reason">
        <el-input
          v-model="ruleForm.reason"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8}"
          style="width: 70%;"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <!-- 加班 -->
    <el-form
      v-else
      ref="ruleForm"
      :model="ruleForm2"
      status-icon
      label-width="110px"
      :rules="rules2"
    >
      <el-form-item label="申请类型">
        <el-select v-model="ruleForm2.processName" placeholder="请选择活动区域" style="width: 50%;">
          <el-option v-for="item in process" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="加班开始时间" prop="start_time">
        <el-date-picker v-model="ruleForm2.start_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 50%;" />
      </el-form-item>
      <el-form-item label="加班结束时间" prop="end_time">
        <el-date-picker v-model="ruleForm2.end_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 50%;" />
      </el-form-item>
      <el-form-item label="补偿方式">
        <span>调休</span>
      </el-form-item>
      <el-form-item label="加班原因" prop="reason">
        <el-input
          v-model="ruleForm2.reason"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8}"
          style="width: 70%;"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnCancel">重置</el-button>
      <el-button type="primary" @click="btnOk">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { startProcess } from '@/api/approvals'
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // 离职
      ruleForm: {
        exceptTime: '',
        reason: '',
        processKey: '', // 特定的审批
        processName: '离职'
        // start_time: '',
        // end_time: ''
      },
      // 加班
      ruleForm2: {
        reason: '',
        processKey: '', // 特定的审批
        processName: '加班',
        start_time: '',
        end_time: ''
      },
      process: ['离职', '加班'],
      rules: {
        exceptTime: [{ required: true, message: '离职时间不能为空' }],
        // start_time: [{ required: true, message: '加班开始时间不能为空' }],
        // end_time: [{ required: true, message: '加班结束时间不能为空' }],
        reason: [{ required: true, message: '原因不能为空' }]
      },
      rules2: {

        start_time: [{ required: true, message: '加班开始时间不能为空' }],
        end_time: [{ required: true, message: '加班结束时间不能为空' }],
        reason: [{ required: true, message: '原因不能为空' }]
      }
    }
  },
  methods: {
    btnCancel() {
      // console.log(1)
      this.ruleForm = {
        exceptTime: '',
        reason: '',
        processKey: '', // 特定的审批
        processName: ''
      }
      this.ruleForm2 = {
        reason: '',
        processKey: '', // 特定的审批
        processName: '加班',
        start_time: '',
        end_time: ''
      }
      this.$refs.ruleForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    btnOk() {
      // console.log(2)
      this.$refs.ruleForm.validate(async val => {
        if (!val) return this.$message.error('表单验证失败')
        // console.log(this.ruleForm)
        if (this.ruleForm.processName === '离职') {
          await startProcess({ ...this.ruleForm, userId: this.$store.getters.userId, processKey: 'process_dimission' })
        } else {
          await startProcess({ ...this.ruleForm2, userId: this.$store.getters.userId, processKey: 'process_overtime' })
        }

        this.$message.success('提交成功')
        this.$emit('update:showDialog', false)
      })
    }
  }
}
</script>

<style>

</style>
