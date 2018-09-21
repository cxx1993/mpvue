import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '账本',
    usingComponents: {
      'i-swipeout': '../../../static/iview/swipeout/index',
      'i-button': '../../../static/iview/button/index',
      'i-panel': '../../../static/iview/panel/index',
      'i-icon': '../../../static/iview/icon/index',
      'i-cell': '../../../static/iview/cell/index',
      'i-toast': '../../../static/iview/toast/index',
      'i-action-sheet': '../../../static/iview/action-sheet/index',
      'i-load-more': '../../../static/iview/load-more/index'
    }
  }
}
