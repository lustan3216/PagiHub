<template>
  <div
    id="art-board"
    class="art-board"
  >
    <component-giver
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
    const page = this.$el
    page.addEventListener('scroll', () => {
      this.scrollTop = page.scrollTop
    })

    if (!this.isExample) {
      const { clientWidth, clientHeight } = this.$el

      this.LAYOUT_SET({
        gridResizing: false,
        artBoardWidth: parseInt(clientWidth),
        artBoardHeight: parseInt(clientHeight)
      })
    }
  },
  activated() {
    if (this.scrollTop) {
      const page = this.$el
      page.scrollTop = this.scrollTop
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' })
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
