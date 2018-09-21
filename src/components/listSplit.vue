<template>
  <div class="split">
    {{date}}
      <span v-if=" income!=0 " class='right'>
          支出：{{income}}        
      </span>
      <span v-if=" outcome!=0 " class='right' style="margin-right:5px">
          收入：{{outcome}}
      </span>
  </div>
</template>

<script>
/**
 * record页面的分隔
 */
export default {
  props: ['income', 'outcome', 'date']
}
</script>

<style lang='scss' scoped>
.split {
  background: rgba(102, 153, 255, 0.05);
  padding: 5px 15px;
  font-size: 12px;
  color: #777;
  .right {
    float: right;
  }
}
</style>
