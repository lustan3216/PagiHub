<template>
  <el-divider />
</template>

<script>
import childrenMixin from '../../mixins/children'
import EditArea from './AreaDraggable'

export default {
  name: 'Divider',
  components: {
    EditArea
  },
  mixins: [childrenMixin],
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
