import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.globalData = getApp().globalData // 绑定全局变量

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/login/main',
      // 'pages/logs/main',
      'pages/record/main',
      '^pages/chart/main',
      'pages/add/main',
      'pages/user/main'
    ],
    tabBar: {
      list: [
        {
          pagePath: 'pages/record/main',
          text: '账本',
          iconPath: '../static/images/tabBar/static/record.png',
          selectedIconPath: '../static/images/tabBar/active/record.png'
        },
        // {
        //   pagePath: 'pages/add/main',
        //   text: '增加',
        //   iconPath: '../static/images/tabBar/static/other.png',
        //   selectedIconPath: '../static/images/tabBar/active/other.png'
        // },
        {
          pagePath: 'pages/chart/main',
          text: '图表',
          iconPath: '../static/images/tabBar/static/chart.png',
          selectedIconPath: '../static/images/tabBar/active/chart.png'
        },
        {
          pagePath: 'pages/user/main',
          text: '我的',
          iconPath: '../static/images/tabBar/static/user.png',
          selectedIconPath: '../static/images/tabBar/active/user.png'
        }
      ]
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#F9D348',
      navigationBarTitleText: '记账本',
      navigationBarTextStyle: 'black'
    }
    // usingComponents: {
    //   'i-input': '../static/iview/input/index'
    // }
  }
}
