<template>
  <div>
    <chart id="chart1" :chartOption="chartOption" :chartData="chartData"></chart>
    <chart id="chart2" :chartOption="chartOption2" :chartData="chartData"></chart>
  </div>
</template>

<script lang="ts">

import Chart from "../../nnt/erp/widgets/chart/Chart.vue";
import {Option} from "../../nnt/model/chart/Option";

export default {
  name: "ChartUseSample",
  components: {Chart},
  data() {
    return {
      chartOption: new Option(),
      chartOption2: new Option(),
      chartData: [],
      chartData2: []
    }
  },
  created() {
    this.getInfo1();
    this.getInfo2()
  },
  methods: {
    getInfo1() {
      let m = new Option();
      m.type = 'bar';
      m.title = '趋势图案例';

      //将api中哪个参数作为横轴
      m.xAxis = 'date';

      //将要查看变化的数据参数放入下列，name为对应的中文名，方便用户理解
      m.series = [
        {
          name: '总分享次数',
          type: 'allcount'
        },
        {
          name: '每日分享',
          type: 'dailyshare'
        },
        {
          name: '邀请数量',
          type: 'invitate'
        }];
      this.chartOption = m;
      //chartData为api从和后台得到的数据
      this.chartData = [
        {date: "2019-02-12", allcount: "933", peoplecount: "521", dailyshare: "354", invitate: "240"},
        {date: "2019-02-12", allcount: "933", peoplecount: "521", dailyshare: "354", invitate: "240"},
        {date: "2019-02-11", allcount: "1584", peoplecount: "876", dailyshare: "557", invitate: "414"},
        {date: "2019-02-10", allcount: "1708", peoplecount: "895", dailyshare: "567", invitate: "437"},
        {date: "2019-02-09", allcount: "1652", peoplecount: "908", dailyshare: "550", invitate: "447"},
        {date: "2019-02-08", allcount: "1763", peoplecount: "994", dailyshare: "623", invitate: "472"},
        {date: "2019-02-07", allcount: "1571", peoplecount: "914", dailyshare: "550", invitate: "448"},
        {date: "2019-02-06", allcount: "1618", peoplecount: "955", dailyshare: "594", invitate: "465"},
        {date: "2019-02-05", allcount: "1684", peoplecount: "977", dailyshare: "589", invitate: "485"},
        {date: "2019-02-04", allcount: "1532", peoplecount: "905", dailyshare: "525", invitate: "446"},
        {date: "2019-02-03", allcount: "1373", peoplecount: "797", dailyshare: "537", invitate: "363"}]
    },
    getInfo2() {
      let m = new Option();
      m.type = 'line';
      m.title = '趋势图案例2';

      //将api中哪个参数作为横轴
      m.xAxis = 'date';

      //将要查看变化的数据参数放入下列，name为对应的中文名，方便用户理解
      m.series = [
        {
          name: '总分享次数',
          type: 'allcount'
        },
        {
          name: '每日分享',
          type: 'dailyshare'
        },
        {
          name: '邀请数量',
          type: 'invitate'
        }];
      this.chartOption2 = m;
      //chartData为api从和后台得到的数据
      this.chartData2 = [
        {date: "2019-02-12", allcount: "933", peoplecount: "521", dailyshare: "354", invitate: "240"},
        {date: "2019-02-12", allcount: "933", peoplecount: "521", dailyshare: "354", invitate: "240"},
        {date: "2019-02-11", allcount: "1584", peoplecount: "876", dailyshare: "557", invitate: "414"},
        {date: "2019-02-10", allcount: "1708", peoplecount: "895", dailyshare: "567", invitate: "437"},
        {date: "2019-02-09", allcount: "1652", peoplecount: "908", dailyshare: "550", invitate: "447"},
        {date: "2019-02-08", allcount: "1763", peoplecount: "994", dailyshare: "623", invitate: "472"},
        {date: "2019-02-07", allcount: "1571", peoplecount: "914", dailyshare: "550", invitate: "448"},
        {date: "2019-02-06", allcount: "1618", peoplecount: "955", dailyshare: "594", invitate: "465"},
        {date: "2019-02-05", allcount: "1684", peoplecount: "977", dailyshare: "589", invitate: "485"},
        {date: "2019-02-04", allcount: "1532", peoplecount: "905", dailyshare: "525", invitate: "446"},
        {date: "2019-02-03", allcount: "1373", peoplecount: "797", dailyshare: "537", invitate: "363"}]
    },

  }
}
</script>

<style lang='scss' scoped>

</style>
