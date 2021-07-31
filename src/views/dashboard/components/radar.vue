<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 按需引入
import * as echarts from 'echarts'
// import * as echarts from 'echarts/core'
// // 引入雷达图表，图表后缀都为 Chart
// import {
//   RadarChart
// } from 'echarts/charts'
// import { LegendComponent } from 'echarts/components'
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import {
//   CanvasRenderer
// } from 'echarts/renderers'
// // 注册必须的组件
// echarts.use(
//   [RadarChart, CanvasRenderer, LegendComponent]
// )
export default {
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.myDiv)

    // 指定图表的配置项和数据
    const option = {
      color: ['#f00', '#0f0', '#00f'],
      textStyle: {
        fontSize: 16
      },
      legend: {
        data: ['上海营业部', '广州营业部', '北京营业部']
      },
      radar: {
        // shape: 'circle',
        // 每个区域的最高值
        indicator: [
          { name: '销售', max: 6500 },
          { name: '利润', max: 16000 },
          { name: '留存率', max: 30000 },
          { name: '退货率', max: 38000 },
          { name: '售后', max: 52000 },
          { name: '市场', max: 25000 }
        ]
      },
      series: [{
        name: '预算 vs 开销（Budget vs spending）',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '上海营业部'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '广州营业部'
          },
          {
            value: [1000, 17000, 2000, 20000, 12000, 21000],
            name: '北京营业部'
          }
        ]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 550px;

}
</style>
