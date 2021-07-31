<template>
  <!-- 公共导入组件 -->
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/import'

export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    // async  success({ header, results }) {
    //   // header表头字段名 results表格的数据
    // //   console.log(header, results)
    //   if (this.type === 'user') {
    //     // 如果是导入员工
    //     const userRelations = {
    //       '入职日期': 'timeOfEntry',
    //       '手机号': 'mobile',
    //       '姓名': 'username',
    //       '转正日期': 'correctionTime',
    //       '工号': 'workNumber'
    //     }
    //     const arr = []
    //     // 遍历所有的数组  表格中的数据
    //     results.forEach(item => {
    //     // 需要将每一个条数据里面的中文都换成英文
    //       const userInfo = {}
    //       Object.keys(item).forEach(key => {
    //       // key是当前的中文名 找到对应的英文名
    //         // console.log(key)
    //         if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
    //         //   console.log(item[key])
    //           userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))// 只有这样, 才能入库
    //           return
    //         }
    //         userInfo[userRelations[key]] = item[key]
    //       })
    //       arr.push(userInfo)
    //     })
    //     // console.log(arr)
    //     await importEmployee(arr) // 调用导入接口
    //     this.$message.success('导入成功')
    //   }
    //   // 回到上一页
    //   this.$router.back()
    // },
    async success(data) {
      console.log(data)
      const newData = data.results.map(item => {
        return this.zh2en(item)
      })
      console.log(newData)
      await importEmployee(newData)
      this.$message.success('导入成功')
      this.$router.back()
    },
    zh2en(item) {
      const newUser = {}
      // 字典
      const dict = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      Object.keys(item).forEach(key => {
        // console.log(item[key])
        let val = item[key]
        if (dict[key] === 'timeOfEntry' || dict[key] === 'correctionTime') {
          val = new Date(this.formatDate(val, '/'))
        }

        newUser[dict[key]] = val
      })
      return newUser
    },
    // 格式化时间
    formatDate(numb, format) {
    //   console.log(numb, format)
    // numb是excel转换出来的整数值，format是年月日之间分隔符号。
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      //   console.log(time)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
