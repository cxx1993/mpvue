import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '',
    usingComponents: {
      'i-input': '../../../static/iview/input/index',
      // 'i-radio': '../../../static/iview/radio/index',
      // 'i-radio-group': '../../../static/iview/radio-group/index',
      'i-button': '../../../static/iview/button/index',
      'i-panel': '../../../static/iview/panel/index',
      'i-drawer': '../../../static/iview/drawer/index',
      'i-icon': '../../../static/iview/icon/index',
      'i-toast': '../../../static/iview/toast/index',
      // 'i-tag': '../../../static/iview/tag/index',
      'i-tabs': '../../../static/iview/tabs/index',
      'i-tab': '../../../static/iview/tab/index'
      //   'i-cell': '../../../static/iview/cell/index',
      //   'i-load-more': '../../../static/iview/load-more/index'
    }
  }
}
