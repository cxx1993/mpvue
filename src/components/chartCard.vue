<template>
    <div>
        <!-- <i-icon type="unfold" /> -->
        <view class="cell"> 
          <view class="icon">
            <div class="i-icon">
              <i-icon :type="info.stName" size="24" color="black" />
            </div>
          </view>
          <view class="content">
            <view class="ft">{{ info.name }} {{ rate }}%<text>{{info.count}}</text></view>
            <progress :percent="rate" activeColor="#f9d348" />  
          </view>  
        </view>
    </div>
</template>

<script>
/**
 * chart页面底部的single cell
 */

export default {
  props: ['info'],
  data() {
    return {}
  },

  computed: {
    rate: function() {
      return (this.info.rate * 100).toFixed(1)
    }
  },

  onLoad: function() {
    // console.log(this.info)
  }
}
</script>

<style lang="scss" scoped>
</style>
