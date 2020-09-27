<template>
  <!--  padding: 1px; 很重要，因為grid item -1px, 如果item貼齊上邊，會因為上面看不到虛線下面看得到虛線-->
  <div
    id="art-board"
    :style="{
      padding: isDraftMode ? '1px' : false
    }"
    class="art-board"
    @scroll.passive="onScroll"
  >
    <template v-if="id">
      <transition
        name="slide"
        mode="out-in"
      >
        <keep-alive>
          <component-giver
            :id="id"
            class="h-100 "
          />
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
      this.artBoardResizing()
    }
  },
  methods: {
    ...mapActions('layout', ['artBoardResizing', 'checkIsGridResizing']),
    onScroll() {
      this.checkIsGridResizing()
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
