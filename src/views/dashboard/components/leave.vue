<template>
  <!-- 请假对话框 -->
  <el-dialog
    title="请假申请"
    :visible="leaveshowDialog"
    width="50%"
    @close="btnCancel"
  >

    <!-- 加班 -->
    <el-form

      ref="ruleForm"
      :model="ruleForm"
      status-icon
      label-width="110px"
      :rules="rules"
    >
      <el-form-item label="假期类型">
        <el-select v-model="ruleForm.processName" placeholder="请选择假期类型" style="width: 50%;">
          <el-option v-for="item in leave" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请单位">
        <span>按天</span>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="ruleForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 50%;" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="ruleForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width: 50%;" />
      </el-form-item>
      <el-form-item v-if="ruleForm.processName==='调休'" label="申请天数" prop="duration" style="width: 50%;">
        <el-input v-model="ruleForm.duration" type="text" />
      </el-form-item>
      <el-form-item v-else label="请假时长" prop="duration" style="width: 50%;">
        <el-input v-model="ruleForm.duration" type="text" />
      </el-form-item>
      <el-form-item label="申请理由" prop="reason">
        <el-input
          v-model="ruleForm.reason"
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
import Enumerate from '@/api/constant/user'
export default {
  props: {
    leaveshowDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      leave: ['请假', '调休'],
      ruleForm: {
        reason: '',
        processKey: '', // 特定的审批
        processName: '',
        startTime: '',
        endTime: '',
        applyUnit: '按天',
        duration: '0',
        holidayType: ''
      },
      rules: {
        startTime: [{ required: true, message: '加班开始时间不能为空' }],
        endTime: [{ required: true, message: '加班结束时间不能为空' }],
        reason: [{ required: true, message: '原因不能为空' }]
      }
    }
  },
  methods: {
    btnCancel() {
      // console.log(1)
      this.ruleForm = {
        reason: '',
        processKey: '', // 特定的审批
        processName: '',
        startTime: '',
        endTime: '',
        applyUnit: '按天',
        duration: '0',
        holidayType: ''
      }
      this.$refs.ruleForm.resetFields()
      this.$emit('update:leaveshowDialog', false)
    },
    btnOk() {
      // console.log(2)
      this.$refs.ruleForm.validate(async val => {
        if (!val) return this.$message.error('表单验证失败')
        // console.log(this.ruleForm)
        // console.log(this.ruleForm.processName)
        const obj = Enumerate.leaveType.find(item =>
          item.value === this.ruleForm.processName
        )
        // console.log(obj)
        // 请假为1，调休为0
        this.ruleForm.holidayType = obj.id

        await startProcess({ ...this.ruleForm, userId: this.$store.getters.userId, processKey: 'process_leave' })

        this.$message.success('提交成功')
        this.$emit('update:leaveshowDialog', false)
      })
    }
  }
}
</script>

<style>

</style>
