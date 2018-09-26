<template>
    <div v-show="periodType===current">
        <!-- :scroll-left="scrollLeft" -->
        <i-tabs color="black" scroll
            :current="current_scroll"
            @change="handleChangeScroll" >
            <i-tab v-for="item in iTabList" :key="item.key" :title="item.title"></i-tab>
        </i-tabs>

        <div class="count">总支出：{{sum}}<text>平均值：{{avg}}</text></div> 
        <!-- 这里插入chart位置 -->
        <div class="title" style="margin-top:200px;">支出排行榜</div>
        <scroll-view style="height:300px" scroll-y>
          <list-cell
              v-for="(item,idx) in cellList" 
              :key="idx"
              :info="item"
              :count="sum" 
          >
          </list-cell>
          <div v-show="cellList.length===0">
            <i-load-more tip="暂无数据" :loading="false" />
          </div>
        </scroll-view>
    </div>
</template>

<script>
import moment from 'moment'
import cell from './chartCard'
import https from '../utils/https'

import { weekFormat, monthFormat, yearFormat, options } from '../utils/chartUT'

const { postReq } = https

export default {
  /**
   * periodType：周期的类型 0-周 1-月 2-年
   * type：收入支出的类型：0-支出 1-收入
   * current：当前show的页
   */
  props: ['periodType', 'current', 'type', 'ec'],
  data() {
    return {
      never: true,
      current_scroll: '',
      scrollLeft: 0,
      sum: 0,
      avg: 0,
      iTabList: [],
      cellList: [], // 排行榜list
      sdate: '',
      edate: ''
    }
  },

  methods: {
    // 计算出时间范围
    caculateDateRange() {
      // eslint-disable-next-line
      const { periodType, current_scroll } = this
      const tabV = current_scroll.replace('tab', '')
      const fullYear = new Date().getFullYear()
      let arrDate
      switch (periodType) {
        case 0:
          // 周
          arrDate = weekFormat(fullYear, tabV)
          break
        case 1:
          arrDate = monthFormat(fullYear, tabV)
          break
        case 2:
          arrDate = yearFormat(tabV)
          break
        default:
          break
      }
      this.sdate = arrDate[0]
      this.edate = arrDate[1]
      // console.log(arrDate)
    },
    // 滚动tab change
    handleChangeScroll({ target }) {
      this.current_scroll = target.key
      this.caculateDateRange()
      this.getData()
    },
    // 初始获取tabbar的数据
    getTabList() {
      const { periodType } = this
      const unit = periodType === 0 ? '周' : periodType === 1 ? '月' : ''
      let sign, i
      // eslint-disable-next-line
      let iTabList = [],
        last

      switch (periodType) {
        case 0: // 最近三个月的周数
          sign = moment().week() // 当前时间所在的周数
          i = sign - 12 > 0 ? sign - 12 : 1
          break
        case 1: // 从年初至今的月份
          sign = moment().month() + 1 // 当前时间所在的月份
          i = 1
          break
        case 2: // 往前倒三年吧，暂时就
          sign = moment().year() // 当前时间所在的月份
          i = sign - 2
          break
        default:
          break
      }

      for (; i <= sign; i++) {
        iTabList.push({ key: 'tab' + i, title: i + unit, value: i })
      }
      last = iTabList[iTabList.length - 1]

      switch (periodType) {
        case 0:
          last.title = '本周'
          break
        case 1:
          last.title = '本月'
          break
        case 2:
          break
        default:
          break
      }
      this.iTabList = iTabList
      this.current_scroll = last.key
      // this.scrollLeft = 2000
    },
    draw: function(categories, data) {},
    getData() {
      const { type, sdate, edate, periodType } = this
      let query = {
        type,
        sdate,
        edate,
        period: periodType
      }
      postReq({
        url: 'records/chart',
        data: query,
        cb: res => {
          const { cellList, avg, sum } = res.rank
          const { xAxis, yAxis } = res.analyze
          // 赋值数据
          this.cellList = cellList
          this.avg = avg
          this.sum = sum

          this.xAxis = xAxis
          this.yAxis = yAxis

          let nOptions = { ...options, ...{} }
          nOptions.options.xAxis.data = xAxis
          nOptions.options.series[0].data = yAxis

          this.$emit('changeEC', nOptions)

          this.never = false // 更新为已获取过
        },
        fb: err => {
          console.log(err)
        }
      })
    }
  },

  components: {
    'list-cell': cell
  },

  computed: {
    showType: function() {
      return this.type ? '收入' : '支出'
    }
  },
  watch: {
    current: function(next, prev) {
      if (next === this.periodType && this.never) {
        // 当前content显示 && 从未获取过数据
        this.caculateDateRange()
        this.getData()
      }
    },
    type: function(next, prev) {
      // 收入/支出类型改变
      this.caculateDateRange()
      this.getData()
    }
  },

  onLoad: function() {
    this.getTabList()
    const { periodType, current } = this
    if (current === periodType) {
      this.caculateDateRange()
      this.getData()
      // this.draw()
    }
  }
}
</script>
