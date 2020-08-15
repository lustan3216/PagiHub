<template>
  <el-tooltip
    :content="content"
    :placement="placement"
    effect="light"
    popper-class="tip"
  >
    <template #content>
      <slot />
    </template>

    <i class="el-icon-info" />
  </el-tooltip>
</template>

<script>
import { Tooltip } from 'element-ui'
export default {
  name: 'Tip',
  components: {
    ElTooltip: Tooltip
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'left'
    }
  }
}
</script>
