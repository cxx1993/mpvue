import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '图表分析',
    usingComponents: {
      // 'i-input': '../../../static/iview/input/index',
      'i-icon': '../../../static/iview/icon/index',
      'i-tabs': '../../../static/iview/tabs/index',
      'i-tab': '../../../static/iview/tab/index',
      'i-load-more': '../../../static/iview/load-more/index',
      'ec-canvas': '../../../static/ec-canvas/ec-canvas'
    }
  }
}
