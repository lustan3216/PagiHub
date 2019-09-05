<template>
  <div class="edit-area">
    <edit-area :children.sync="innerChildren"/>
  </div>
</template>

<script>
import childrenMixin from '../../mixins/children'
import EditBar from '../Components/EditBar'
import EditArea from '../Components/EditArea'
import clone from 'clone'

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
  },
  methods: {
    copy(index) {
      const cloned = clone(this.innerChildren[index])
      this.innerChildren.splice(index, 0, cloned)
    },
    remove(index) {
      this.innerChildren.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-area{
  height: 100%;
}
</style>
