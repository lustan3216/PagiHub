<template>
  <div class="edit-area">
    <edit-area :children.sync="innerChildren" />
  </div>
</template>

<script>
import childrenMixin from '../../mixins/children'
import EditArea from './AreaDraggable'

export default {
  name: 'Blank',
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
