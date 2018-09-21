<template>
    <div>
      <div class="switchHead">
        <ul>
            <li
                v-for="item in switchArr" 
                :class="item.target === period?'active':''" 
                :key="item.target"
                @click="changPeriod(item.target)"
            >
                {{item.cycle}}
            </li>
        </ul>
        <picker @change="bindPickerChange" :value="arrIdx" :range="array">
            <view class="picker">
                {{ array[arrIdx]}}<i-icon type="unfold" />
            </view>
        </picker>
        <a class="link" href="#">
            <i-icon type="refresh" />
        </a>
    </div>
  </div>
    
</template>

<script>
/**
 * 图标分析页面的head
 */

export default {
  props: ['period', 'changeDateCB'],
  data() {
    return {
      arrIdx: 0,
      array: ['支出', '收入'],
      switchArr: [
        { cycle: '周', target: 0 },
        { cycle: '月', target: 1 },
        { cycle: '年', target: 2 }
      ]
    }
  },

  methods: {
    changPeriod: function(period) {
      // this.period = period
      // 触发父级
      this.changeDateCB({ period })
    },
    bindPickerChange: function(e) {
      // 触发父级
      // this.arrIdx = e.target.value
      this.$emit('changeType', e.target.value)
    }
  },

  // watch: {
  //   period(newValue, oldValue) {
  //     this.getTabList()
  //   }
  // },

  onLoad: function(e) {}
}
</script>

<style lang="scss" scoped>
.switchHead {
  line-height: 40px;
  background: #f9d348;
  //   background: yellow;
  color: black;
  width: 100%;
  height: 40px;
  overflow: hidden;
  position: relative;
  font-size: 14px;
  text-align: center;
  ._ul {
    margin: 6px 0 0 3%;
    overflow: hidden;
    float: left;
    line-height: 1;
    width: 65%;
    display: flex;
    // height: 100%;
    border: 1px solid black;
    border-radius: 5px;
    ._li {
      padding: 6px 0;
      text-align: center;
      border-right: 1px solid black;
      //   float: left;
      //   width: 33%;
      flex: 1;
      &:last-child {
        border-right: none;
      }
      &.active {
        background: black;
        color: #f9d348;
      }
    }
  }
  .picker {
    width: 15%;
    float: right;
  }
  .link {
    width: 10%;
    float: right;
  }
}
</style>

