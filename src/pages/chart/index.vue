<template>
  <div class="chart">
    <switch-head :period="period" 
      :changeDateCB="changeDate"
      @changeType="type = $event"
    >
    </switch-head>
    <p-content :type="type" :current="period" :periodType="0" @changeEC="ec0 = $event">0</p-content>
    <p-content :type="type" :current="period" :periodType="1">1</p-content>
    <p-content :type="type" :current="period" :periodType="2">2</p-content>
    
    {{ec0}}
    <div class="ec" v-bind:style="{ opacity: activeOpacity0 }"><ec-canvas class="canvas" id="mychart-dom-bar" canvas-id="mychart-bar0" :ec="ec0"></ec-canvas></div>
    <div class="ec" v-bind:style="{ opacity: activeOpacity1 }"><ec-canvas class="canvas" id="mychart-dom-bar" canvas-id="mychart-bar1" :ec="ec1"></ec-canvas></div>
    <div class="ec" v-bind:style="{ opacity: activeOpacity2 }"><ec-canvas class="canvas" id="mychart-dom-bar" canvas-id="mychart-bar2" :ec="ec2"></ec-canvas></div>
        
  </div>
</template>

<script>
import head from '../../components/switchHead'
import './index.scss'
import content from '../../components/chartContent'
import { options } from '../../utils/chartUT'

export default {
  data() {
    return {
      period: 0, // 周年月
      type: 0, // 收入1/支出0
      ec0: options,
      ec1: options,
      ec2: options,
      activeOpacity0: 1,
      activeOpacity1: 0,
      activeOpacity2: 0
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
    }
  },

  watch: {
    period: function(prev, next) {
      switch (next) {
        case 0:
          this.activeOpacity0 = 1
          this.activeOpacity1 = 0
          this.activeOpacity2 = 0
          break
        case 1:
          this.activeOpacity0 = 0
          this.activeOpacity1 = 1
          this.activeOpacity2 = 0
          break
        case 2:
          this.activeOpacity0 = 0
          this.activeOpacity1 = 0
          this.activeOpacity2 = 1
          break
        default:
          this.activeOpacity0 = 0
          this.activeOpacity1 = 0
          this.activeOpacity2 = 0
          break
      }
    }
  },

  onLoad: function(e) {}
}
</script>

<style lang="scss" >
</style>
