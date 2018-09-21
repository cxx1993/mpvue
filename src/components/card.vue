<template>
  <div>
    <p class="card">
      {{text}}
    </p>
  </div>
</template>

<script>
/**
 * 暂时没啥用
 * test
 */
export default {
  props: ['text']
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
