<template>
  <div>
    <dl class="count">
      <dt>
        <b>{{year}}年</b>
        <div>
          <picker 
            mode="date" fields="month"
            :value=" year+ '-'+ month"
            @change="bindDateChange"
          >
            <view class="picker">
              {{month}}月<i-icon type="unfold" />
            </view>
          </picker>   
        </div>
      </dt>
      <dd>
        <b>收入</b>
        <div>{{totalIncome}}</div>
      </dd>
      <dd>
        <b>支出</b>
        <div>{{totalOutcome}}</div>     
      </dd>
    </dl>
    <!-- list -->
    <!-- @scrolltoupper="showHB('prev')"
      @scrolltolower="showHB('next')" -->
    <scroll-view 
      v-bind:style="{ height: scrollUseHeight + 'px' }"
      scroll-y="true"
      :scroll-top="scrollPosition"
    >
      <view v-show="showTop">
        <i-button size="small" @click="handleClick('prev')" long="true">查询上月信息</i-button>
      </view>

      
      
      <i-cell-group>
        <!-- <i-panel v-for="item in renderList" :key="item._id">
          <c-split v-if='item.type===1' :date="item.date" :income="item.income" :outcome="item.outcome"></c-split>
          <i-cell v-if='item.type===0' :title="item.title" :value="item.value">
            <i-icon :type="item.icon" slot="icon" class="icon"/>
          </i-cell>
        </i-panel> -->
        <i-panel v-for="(item,index) in renderList" :key="item.id">
          <c-split v-if='item.type===1' :date="item.date" :income="item.income" :outcome="item.outcome"></c-split>
          <i-swipeout v-if='item.type===0' 
            i-class="i-swipeout-demo-item" 
            :operateWidth="120" 
            :unclosable="true" 
            :toggle="item.toggle">
            <view slot="content">
              <view class="i-swipeout-image">
                <i-icon size="20" color="#FFFFFF" :type="item.icon"></i-icon>
              </view>
              <view class="i-swipeout-des">
                <i-cell styles="padding:8px 0 !important;" :title="item.title" :value="item.value"></i-cell>
              </view>
            </view>
            <view slot="button" class="i-swipeout-button-group">
                <view class="i-swipeout-button" @click="jumpToUpdate(item.id,index)"> <i-icon size="32" type="brush"></i-icon></view>
                <view class="i-swipeout-button del" @click="del(item.id,index)"><i-icon size="32" type="trash"></i-icon></view>
            </view>
          </i-swipeout>
        </i-panel>
        <view v-if="renderList.length == 0" style="padding-top:1em">
          <i-load-more tip="暂无数据" :loading='false'/>
        </view>
      </i-cell-group>
      <view v-show="showBottom">
        <i-button size="small" @click="handleClick('next')" long="true">查询下月信息</i-button>
      </view>
    </scroll-view>
    <!-- i-action-sheet -->
    <i-action-sheet mask-closable show-cancel 
      :visible="actionVisable" 
      :actions="actions"
      @cancel="handleActionCancel" 
      @click="handleActionClick" >
      <view slot="header" style="padding: 16px">
          <view style="color: #444;font-size: 16px">确定删除？</view>
          <text>删除后无法恢复哦</text>
      </view>
    </i-action-sheet>
    <i-toast id="toast" />
    <navigator url="/pages/add/main" class="nav_add">
      <i-icon type="add" size="24" />
    </navigator>
  </div>

  
</template>

<script>
// vendor
import moment from 'moment'
// component
import split from '../../components/listSplit'
// mixins
import list from '../../mixins/list'
// untils
import https from '../../utils/https'

const { $Toast } = require('../../../static/iview/base/index')
const { delReq } = https

moment.locale('zh-cn') // 设置中文

export default {
  data() {
    return {
      // searchTime: '', // 查询时间 时间差3s
      scrollPosition: 0, // scroll-view的滚动位置
      totalIncome: 0.0, // 总收入
      totalOutcome: 0.0, // 总支出
      showTop: false, // 是否显示头部
      showBottom: false, // 是否显示底部
      url: 'records/list', // 请求的url
      query: {
        options: { limit: 1000 } // 不限制个数
      }, // list的查询参数
      renderList: [], // 处理过render的list
      year: 0, // 当前选中年份
      month: 0, // 当前选中月份
      pickerEnd: 0, // 当前年月：用于筛选picker的选择，不能超过   -->  不做检查
      scrollUseHeight: 0, // scroll-view可用高度
      actionVisable: false,
      actions: [
        {
          name: '确定',
          color: '#ed3f14'
        }
      ],
      actionCurrent: {
        id: '',
        index: ''
      }
    }
  },
  mixins: [list],
  components: {
    'c-split': split
  },

  methods: {
    // picker的日期改变
    bindDateChange: function(e) {
      const { value } = e.target
      const ym = value.split('-')
      // if (value >= this.pickerEnd) {
      //   // 时间超出
      // } else {
      this.handleDate(ym[0], ym[1]) // 获取query的sdate edate
      this.loadData()
      // }
    },
    // 上拉下拉加载其余月份
    handleClick(type) {
      const { month, year } = this // +1后的
      let m, // eslint-disable-line
        y = year
      if (type === 'next') {
        // 下一个月
        if (month === 12) {
          m = 1
          y = year + 1
        } else {
          m = month + 1
        }
      } else {
        // 上一个月
        if (month === 1) {
          m = 12
          y = year - 1
        } else {
          m = month - 1
        }
      }
      this.handleDate(y, m)
      this.loadData()
    },
    // 一次查询一个月的
    loadData() {
      // const nT = new Date().getTime()
      const that = this
      // new Promise((resolve, reject) => {
      //   if (!this.searchTime) {
      //     this.searchTime = nT // 存储毫秒
      //     resolve()
      //   }

      //   if (nT - this.searchTime < 3 * 1000) {
      //     // 时间戳为3s
      //     // reject()
      //   } else {
      //     resolve()
      //   }
      // })
      //   .then(res => {
      // that.searchTime = nT // 存储毫秒
      that.getData(res => {
        that.handleRenderList()
        that.showBottom = true
        that.showTop = true
      })
      // })
      // .catch(err => {
      //   console.log(err)
      // })
    },
    // 获取时间
    handleDate(year, month) {
      const date = new Date()
      let y, m
      if (year && month) {
        // 如果传入year month --> 证明不是第一次进入
        y = year
        m = month
      } else {
        y = date.getFullYear()
        m = date.getMonth() + 1
      }

      const sdate = new Date(y, m - 1, 1)
      const edate = new Date(y, m, 0)

      if (!(year && month)) {
        // 如果没传year month 设置最大可查询年月
        this.pickerEnd = y + '-' + (m < 10 ? '0' + m : m)
      }
      this.year = y
      this.month = m
      // console.log(moment(sdate).format('YYYY/MM/DD hh:mm:ss'))
      // console.log(moment(edate).format('YYYY/MM/DD hh:mm:ss'))
      // update post - query
      this.query = {
        ...this.query,
        ...{
          query: {
            sdate: moment(sdate)
              .format('YYYY/MM/DD hh:mm:ss')
              .replace('12:00:00', '00:00:00'),
            edate: moment(edate).format('YYYY/MM/DD hh:mm:ss')
          }
        }
      }
    },
    // 渲染list列表
    handleRenderList() {
      const { docs } = this
      let arr = []
      // eslint-disable-next-line
      let dPoint = 0, // 要插入的split的arr位置
        d, // 记录最新的day
        sIncome = 0, // split收入总和
        sOutcome = 0 // split支出总和
      // 当月收入总和&支出总和
      let totalIncome = 0 // eslint-disable-line
      let totalOutcome = 0 // eslint-disable-line
      let currentDateArr = [] // 数组记录变动的天

      for (let len = docs.length, j = 0; j < len; j++) {
        const currentDate = new Date(docs[j].createDate)

        if (!d) {
          // 第一次赋值
          d = currentDate.getDate()
          currentDateArr.push(currentDate)
        }
        if (d !== currentDate.getDate()) {
          // 新的一天
          // todo1：push split
          pushArr()
          d = currentDate.getDate()
          // todo2: 复位split的outcome income
          sIncome = 0
          sOutcome = 0
          dPoint = arr.length // 更新dPoint
          currentDateArr.push(currentDate) // 更新arr
        }

        if (docs[j].type === 1) {
          sIncome += docs[j].balance // split支出++
          totalIncome += docs[j].balance // 总支出++
        } else {
          sOutcome += docs[j].balance // split收入++
          totalOutcome += docs[j].balance // 总收入++
        }

        if (j === len - 1) {
          // list的最后一项
          pushArr()
        }

        // push list cell
        arr.push({
          type: 0,
          title: docs[j].content,
          value: (docs[j].type ? '+' : '-') + docs[j].balance,
          icon: docs[j].stName,
          toggle: false,
          id: docs[j]._id
        })
      }

      this.totalIncome = totalIncome.toFixed(2)
      this.totalOutcome = totalOutcome.toFixed(2)
      this.renderList = arr
      if (docs.length) {
        this.scrollPosition = 40
      } else {
        this.scrollPosition = 0
      }

      // arr指定位置插入split
      function pushArr() {
        const cd = currentDateArr[currentDateArr.length - 1]
        var day = moment(cd)
        arr.splice(dPoint, 0, {
          type: 1,
          date: day.format('MM月DD日') + '  ' + day.format('dddd'),
          income: sIncome,
          outcome: sOutcome
        })
      }
    },
    // 删除一个
    del(id, index) {
      this.actionCurrent = {
        id,
        index
      }
      this.actionVisable = true
    },
    // 跳转编辑
    jumpToUpdate(id, index) {
      // 跳转页面
      wx.navigateTo({
        url: `/pages/add/main?id=${id}`
      })
      // 关闭i-swipeout
      this.renderList[index].toggle = !this.renderList[index].toggle
    },
    // actionSheet提示 - 取消
    handleActionCancel() {
      const { actionCurrent } = this
      this.actionVisable = false
      // eslint-disable-next-line
      this.renderList[actionCurrent.index].toggle = !this.renderList[
        actionCurrent.index
      ].toggle
      this.actionCurrent = {}
    },
    // actionSheet提示 - 确定
    handleActionClick() {
      const { actionCurrent } = this
      if (actionCurrent && actionCurrent.id) {
        delReq({
          url: `records/delete/${actionCurrent.id}`,
          cb: res => {
            // eslint-disable-next-line
            this.renderList[actionCurrent.index].toggle = !this.renderList[
              actionCurrent.index
            ].toggle
            this.actionVisable = false
            //  刷新网页
            this.loadData()
            $Toast({
              content: res.message
            })
          }
        })
      }
    }
  },

  onShow() {
    if (this.globalData.shouldIndexUpdate) {
      // 新增/编辑过，重新取数据
      this.loadData()
      this.globalData.shouldIndexUpdate = false
    }
  },
  onLoad() {
    console.log('onLoad')
    this.scrollUseHeight = wx.getSystemInfoSync().windowHeight - 45
    this.handleDate() // 获取query的sdate edate
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.nav_add {
  position: fixed;
  right: 10px;
  bottom: 20px;
  background: rgba(128, 128, 128, 0.8);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  line-height: 45px;
  text-align: center;
}
.count {
  background: #f9d348;
  display: flex;
  // flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  color: #111;
  font-size: 18px;
  height: 45px;
  ._dt {
    text-align: center;
    flex: 1;
  }
  ._dd {
    text-align: center;
    flex: 2;
  }
  ._b {
    font-size: 14px;
  }
}

.icon {
  width: 48rpx;
  height: 48rpx;
  background: #ededed;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
}
.i-swipeout-image {
  float: left;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 40px;
  background: rgba(102, 153, 255, 0.8);
}
.i-swipeout-des {
  margin-left: 50px;
}
// .i-swipeout-des-detail {
//   font-size: 12px;
//   word-break: break-all;
//   color: #80848f;
// }
.i-swipeout-button-group {
  height: 100%;
  width: 100%;
  .i-swipeout-button {
    width: 60px;
    float: left;
    display: flex;
    height: 100%;
    justify-content: center;
    background: rgba(102, 153, 255, 0.8);
    color: #fff;
    align-items: center;
    &.del {
      background: rgba(128, 132, 143, 0.6);
    }
  }
}
</style>
