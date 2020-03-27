<template>
  <div>
    <el-divider />
  </div>
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'Divider',
  mixins: [commonMixin],
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
