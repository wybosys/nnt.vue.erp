<template>
  <div id="defaultChartSample" style="width: 600px;height:400px;"></div>
</template>

<script lang="ts">
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/chart/line';

  export default {
    name: "ChartSample",
    data() {
      return {
        option: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }]
        }
      }
    },
    mounted() {
      this.myChart = echarts.init(<HTMLDivElement>document.getElementById("defaultChartSample"));
      this.myChart.setOption(this.option);
    },

  }
</script>

<style lang='scss' scoped>

</style>
