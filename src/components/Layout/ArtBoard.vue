<template>
  <div
    id="art-board"
    class="art-board"
  >
    <component-giver
      v-if="node"
      :id="id"
      :key="id"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ComponentGiver from '../TemplateUtils/ComponentGiver'

export default {
  name: 'ArtBoard',
  components: {
    ComponentGiver
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      scrollTop: 0
    }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    }
  },
  mounted() {
    this.$el.addEventListener('scroll', this.updateScrollTop)
    this.$bus.$emit('art-board-mounted')
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.updateScrollTop)
  },
  activated() {
    if (this.scrollTop) {
      const page = this.$el
      page.scrollTop = this.scrollTop
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    updateScrollTop() {
      this.scrollTop = this.$el.scrollTop
    }
  }
}
</script>

<style scoped lang="scss">
.art-board {
  overflow: scroll;
  background-color: #fff;
  height: 100%;
}
</style>
