<template>
  <div class="edit-area">
    <edit-area :children.sync="innerChildren" />
  </div>
</template>

<script>
import childrenMixin from '../../mixins/children'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'

export default {
  name: 'Blank',
  components: {
    EditBar,
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
