<template>
  <div>
    <el-divider />
  </div>
</template>

<script>
import nodeMixin from '../../mixins/node'

export default {
  name: 'Divider',
  mixins: [nodeMixin],
  data() {
    return {
      isHover: false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
</style>
