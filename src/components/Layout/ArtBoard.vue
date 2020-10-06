<template>
  <div
    id="art-board"
    class="art-board"
  >
    <template v-if="id">
      <transition
        name="slide"
        mode="out-in"
      >
        <keep-alive>
          <component-giver :id="id" />
        </keep-alive>
      </transition>
    </template>
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
      type: String,
      required: true
    }
  },
  computed: {
    node() {
      return this.nodesMap[this.id]
    }
  },
  watch: {
    node() {
      if (!this.isExample) {
        const { clientWidth, clientHeight } = this.$el

        this.LAYOUT_SET({
          gridResizing: false,
          artBoardWidth: parseInt(clientWidth),
          artBoardHeight: parseInt(clientHeight)
        })
      }
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
