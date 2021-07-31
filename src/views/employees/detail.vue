<template>
  <!-- 用户详情页 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 面包屑 -->
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="userForm" label-width="120px" style="margin-left: 120px; margin-top:30px" :model="userInfo" :rules="rules">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <userInfo :user-info="userInfo" /> -->
            <component :is="userInfoName" ref="fromref" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 放置岗位详情 -->
            <component :is="jobInfoName" />
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
// 用户基本信息
import { getUserDetailById } from '@/api/user'
// 保存用户信息
import { saveUserDetailById } from '@/api/employees'
import userComponent from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    JobInfo,
    userComponent
  },
  data() {
    return {
      userInfoName: 'userComponent',
      jobInfoName: 'JobInfo',
      id: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      }, //   专门存放基本信息
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    //   用户基本信息
    async getUserDetailById() {
      const res = await getUserDetailById(this.id)
      // console.log(res)

      this.userInfo = res
      // console.log(this.userInfo)
    },
    // 点击更新
    saveUser() {
      this.$refs.userForm.validate(async val => {
        if (!val) return this.$message.error('表单验证失败')
        // 因为password是密文  所以定义了一个password2替换
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        await this.$store.dispatch('user/getUserInfo')// 用户资料
        this.$message.success('更新成功')
        this.$refs.fromref.getUserDetailById()
      })
    }

  }
}
</script>

<style>

</style>
