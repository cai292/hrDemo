<template>
  <!-- 员工 -->
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部 -->
      <PageTools :show-before="true">
        <template #before>  一共 {{ page.total }} 条数据</template>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
          <el-button size="small" type="primary" icon="el-icon-plus" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格区域 -->
      <el-card v-loading="loading">
        <el-table
          border
          :data="list"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column label="头像" align="center">
            <!-- 结构row -->
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            sortable
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            sortable
            label="手机号"
          />
          <el-table-column
            prop="workNumber"
            sortable
            label="工号"
          />
          <!-- formatter 用来格式化内容 Function(row, column, cellValue, index) -->
          <el-table-column
            prop="formOfEmployment"
            :formatter="formatEmployment"
            sortable
            label="聘用形式"
          />
          <el-table-column

            sortable
            label="部门"
            prop="departmentName"
          />
          <el-table-column
            label="入职时间"
            sortable
          >
            <!-- 处理过滤时间 -->
            <template slot-scope="scope">
              {{ scope.row.timeOfEntry|formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            sortable
          >
            <template slot-scope="scope">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <!-- element UI 默认绑定是一个 v-model 双向绑定 -->
              <!-- 其实是 :value 和 @input 的结合简化语法糖
              这里只需要 data 数据渲染即可, 无需交互(@input) -->
              <el-switch
                :value="scope.row.enableState===1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            width="280"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(scope.row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页数据 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        :page-size="page.size"
        :page-sizes="[1, 5, 8, 10]"
        :current-page="page.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹窗 -->
    <AddDemployee :show-dialog.sync="showDialog" />

    <!-- 二维码弹窗 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 角色弹窗 -->
    <assignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import AddDemployee from './components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import assignRole from './components/assign-role.vue'
export default {
  components: {
    AddDemployee,
    assignRole
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showDialog: false, // 控制弹窗
      showCodeDialog: false, // 二维码弹窗
      showRoleDialog: false,
      userId: ''// 点击角色拿到对应id
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表数据
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      console.log(rows)
      this.list = rows.map(item => { return { ...item, enableState: item.enableState || 1 } })
      // console.log(this.list)
      this.loading = false
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.page.page = val
      this.getEmployeeList()
    },
    // 条数发生改变
    handleSizeChange(val) {
      this.page.size = val
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // console.log(row, column, cellValue, index)
      const obj = EmployeeEnum.hireType.find(item => +item.id === +cellValue)
      // console.log(obj)
      return obj ? obj.value : '未知'
    },
    // 删除按钮
    async delEmployee(id) {
      // console.log(id)
      const confirmremove = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmremove)
      // 用户点击取消
      if (confirmremove === 'cancel') return this.$message.info('用户取消删除')
      await delEmployee(id)
      // 如果发现当前页不是第一页而且只剩下最后一条, 往前翻页
      if (this.list.length === 1 && this.page.page > 1) {
        this.page.page--
      }
      this.$message.success('删除员工成功')
      this.getEmployeeList()
    },
    // async exportExcel() {
    //   // 表格头部
    //   const headers = {
    //     '姓名': 'username',
    //     '手机号': 'mobile',
    //     '入职日期': 'timeOfEntry',
    //     '聘用形式': 'formOfEmployment',
    //     '转正日期': 'correctionTime',
    //     '工号': 'workNumber',
    //     '部门': 'departmentName'
    //   }
    //   // 懒加载  按需引入
    //   const { export_json_to_excel } = await import('@/vendor/Export2Excel')
    //   // console.log(export_json_to_excel)
    //   // 员工的数据
    //   const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
    //   const data = this.formatJson(headers, rows)
    //   // console.log(rows)
    //   // console.log(data)
    //   // 格式
    //   export_json_to_excel({
    //     header: Object.keys(headers),
    //     data,
    //     filename: '员工信息表',
    //     autoWidth: true,
    //     bookType: 'xlsx'
    //   })
    // },
    // 该方法负责将数组转化成二维数组
    // formatJson(headers, rows) {
    //   // console.log(headers)
    //   // 首先遍历数组
    //   return rows.map(item => {
    //     return Object.keys(headers).map(key => {
    //       // 如果是入职时间跟转正时间  就要格式化时间
    //       if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
    //         console.log(item[headers[key]])
    //         return formatDate(item[headers[key]]) // 返回格式化之前的时间
    //       } else if (headers[key] === 'formOfEmployment') {
    //         // 聘用形式
    //         const en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
    //         return en ? en.value : '未知'
    //       }
    //       return item[headers[key]]
    //     }) // => ["张三", "13811"，"2018","1", "2018", "10002"]
    //   })
    // },
    // 点击头像

    //  点击导出
    async  exportExcel() {
      const dict = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      //   // 员工的数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = rows.map(item => {
        return this.obj2Arr(item, dict)
      })
      // console.log(data)
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      export_json_to_excel({
        header: Object.keys(dict),
        data
      })
    },
    obj2Arr(user, headers) {
      // console.log(user)
      const newUser = []

      // 字典处理
      Object.keys(headers).forEach(key => {
        // console.log(key)

        const enKey = headers[key]
        // console.log(enKey)
        let val = user[enKey]
        // console.log(val)
        if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
          val = formatDate(val)
        }
        if (enKey === 'formOfEmployment') {
          const obj = EmployeeEnum.hireType.find(item => item.id === val)
          val = obj ? obj.value : '未知'
        }
        newUser.push(val)
      })

      return newUser
    },
    showQrCode(url) {
      // console.log(url)
      if (url) {
        this.showCodeDialog = true// 打开模态框
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维，
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 点击角色按钮
    assignRole(id) {
      this.userId = id
      // 打开模态框
      this.showRoleDialog = true
      // 调用子组件的方法
      this.$refs.assignRole.getUserDetailById(id)
    }
  }
}
</script>

<style></style>
