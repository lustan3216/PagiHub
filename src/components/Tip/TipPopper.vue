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

    <i :class="icon" />
  </el-tooltip>
</template>

<script>
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
    icon: {
      type: String,
      default: 'el-icon-info'
    }
  }
}
</script>
