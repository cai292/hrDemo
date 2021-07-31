<template>

  <div>
    <el-row :gutter="10" type="flex" justify="end">
      <!-- 年份 -->
      <el-col :span="5">
        <el-select v-model="currentYear" size="small" @change="dateChange">
          <el-option v-for="item in yearList" :key="item" :label="item+'年'" :value="item" />
        </el-select>
      </el-col>
      <!-- 月份 -->
      <el-col :span="5">
        <el-select v-model="currentMonth" size="small" @change="dateChange">
          <el-option v-for="item in 12" :key="item" :label="item+'月'" :value="item" />
        </el-select>
      </el-col>
    </el-row>
    <el-calendar v-model="currentDate">
      <template #dateCell="{date,data}">
        <!-- date（当前单元格的日期）, data{ type, isSelected, day} type 表示该日期的所属月份 isSelected 标明该日期是否被选中；day 是格式化的日期 -->
        <div class="date-content">
          <span class="text"> {{ data.day|getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>

export default {
  // 过滤时间
  filters: {
    getDay(value) {
      const day = value.split('-').slice(2).join('')

      //   const day = value.split('-')[2]
      //   console.log(day)
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  data() {
    return {
      currentDate: new Date(),
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      //   currentDate: null,
      yearList: []
    }
  },
  created() {
    // 处理时间
    // 月份
    this.currentMonth = this.currentDate.getMonth() + 1
    // getFullYear返回一个表示年份的4位数字
    this.currentYear = this.currentDate.getFullYear()
    for (let index = 0; index < 11; index++) {
      // 让年份上下加5
      this.yearList.push(this.currentYear + index - 5)
    }
    console.log(this.yearList)
  },
  methods: {
    isWeek(val) {
      // getDay()返回0-6的数字
    //   console.log(val.getDay())
      return val.getDay() === 6 || val.getDay() === 0
    },
    // 年份月份改变时
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      //   选中后固定为1号
      this.currentDate = new Date(`${year}-${month}-1`)
      console.log(this.currentDate)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 12px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
</style>
<style   >
 .el-calendar-day {
  height:  auto;
 }
 .el-calendar-table__row td, .el-calendar-table tr td:first-child,  .el-calendar-table__row td.prev{
  border:none;
 }

 .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 .el-calendar__header {
   display: none
 }
 .el-calendar-table .el-calendar-day{
     height: 60px;
 }
 .el-calendar__body{
     padding-bottom: 0;
 }
</style>
