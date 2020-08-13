<template>
  <el-tooltip effect="light" :content="content" :placement="placement">
    <template #content>
      <slot/>
    </template>

    <i class="el-icon-info"/>
  </el-tooltip>
</template>

<script>
  import { Tooltip } from 'element-ui'
  export default {
    name: 'Tip',
    props: {
      content: {
        type: String,
        default: ''
      },
      placement: {
        type: String,
        default: 'left'
      },
    },
    components: {
      ElTooltip:  Tooltip
    }
  }
</script>

<style scoped lang="scss">

</style>
