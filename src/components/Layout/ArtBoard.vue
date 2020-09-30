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
          <component-giver
            :id="id"
            class="h-100"
          />
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ComponentGiver from '../TemplateUtils/ComponentGiver'

export default {
  name: 'ArtBoard',
  components: {
    ComponentGiver
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
      const { clientWidth, clientHeight } = this.$el

      this.LAYOUT_SET({
        gridResizing: false,
        artBoardWidth: parseInt(clientWidth),
        artBoardHeight: parseInt(clientHeight) - 2
      })
    }
  },
  methods: {
    ...mapMutations('layout', { 'LAYOUT_SET': 'SET' })
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
