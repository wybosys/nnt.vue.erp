<template>
  <div :id="nowId" style="width: 600px;height:400px;"></div>
</template>

<script lang="ts">
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/chart/line';
  import {MChartOption} from "../../config/dataMap";
  import 'echarts/lib/chart/bar';

  export default {
    name: "MChart",
    props: {
      id: {
        type: String
      },
      chartOption: {
        type: MChartOption,
        required: true
      },
      chartData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        showInfo: false,
        formatedData: [],
        myChart: '',
        originData: {
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['邮件营销']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210],
              itemStyle: {normal: {label: {show: true}}}
            }
          ]
        }
      }
    },
    computed: {
      nowId() {
        return this.id ? this.id : 'defaultChart'
      }
    },
    mounted() {
      let id = this.id;
      this.myChart = echarts.init(document.getElementById(id));
      this.myChart.setOption(this.originData);
      this.getChartMap()
    },
    methods: {
      getChartMap() {
        let data = {
          title: {
            text: this.chartOption.title,
          },
          legend: {
            data: []
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: []
        };
        this.chartData.forEach(e => {
          if (e[this.chartOption.xAxis]) {
            data.xAxis.data.push(e[this.chartOption.xAxis]);
          }
        });

        let series = [];
        this.chartOption.series.forEach((e, i) => {
          let t = {
            name: e.name,
            type: this.chartOption.type,
            data: [],
            itemStyle: {normal: {label: {show: true}}}
          };
          data.legend.data.push(e.name);
          this.chartData.forEach(data => {
            if (data && data[e.type]) {
              t.data.push(data[e.type])
            }
          });
          series.push(t)
        });
        data.series = series;
        this.formatedData = data;
        this.myChart.setOption(data);
      }
    }
  }
</script>

<style lang='scss' scoped>
</style>
