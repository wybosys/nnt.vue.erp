<template>
  <div ref="chart"></div>
</template>

<script lang="ts">

import echarts from "echarts";
import {Chart} from "../../../model/chart/Chart";

export default {
  name: "Chart",
  props: {
    model: {
      type: Chart, // Chart
      require: true
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart, 'light', this.calcedOption);
  },
  computed: {
    calcedOption() {
      return {};
    }
  }
}

</script>
