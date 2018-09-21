<template>
  <div>
    <switch-head :period="period" 
      :changeDateCB="changeDate"
      @changeType="type = $event"
    >
    </switch-head>
    <p-content :type="type" :current="period" :periodType="0">0</p-content>
    <!-- <p-content :type="type" :current="period" :periodType="1">1</p-content>
    <p-content :type="type" :current="period" :periodType="2">2</p-content> -->
    
  </div>
</template>

<script>
// var WXCharts = require('../../utils/wxcharts.js')

import head from '../../components/switchHead'
import './index.scss'
import content from '../../components/chartContent'

var lineChart = null
export default {
  data() {
    return {
      period: 0, // 周年月
      type: 0 // 收入1/支出0
    }
  },

  components: {
    'switch-head': head,
    'p-content': content
  },

  methods: {
    // 修改period周年月
    changeDate({ period }) {
      if (period !== undefined) this.period = period
    },
    touchHandler: function(e) {
      console.log(lineChart.getCurrentDataIndex(e))
      lineChart.showToolTip(e, {
        // background: '#7cb5ec',
        format: function(item, category) {
          return category + ' ' + item.name + ':' + item.data
        }
      })
    },
    createSimulationData: function() {
      var categories = []
      var data = []
      for (var i = 0; i < 10; i++) {
        categories.push('2016-' + (i + 1))
        data.push(Math.random() * (20 - 10) + 10)
      }
      // data[4] = null;
      return {
        categories: categories,
        data: data
      }
    },
    updateData: function() {
      var simulationData = this.createSimulationData()
      var series = [
        {
          name: '成交量1',
          data: simulationData.data,
          format: function(val, name) {
            return val.toFixed(2) + '万'
          }
        }
      ]
      lineChart.updateData({
        categories: simulationData.categories,
        series: series
      })
    }
  },

  onLoad: function(e) {}
}
</script>

<style lang="scss" >
</style>
