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
    <template v-if="editingComponentSetId">
      <transition
        name="slide"
        mode="out-in"
      >
        <keep-alive>
          <component-set
            :id="editingComponentSetId"
            :key="editingComponentSetId"
          />
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ComponentSet from '../Templates/ComponentSet'
import { updateWrapperStyle } from '@/utils/quickFunction'

export default {
  name: 'ArtBoard',
  components: {
    ComponentSet
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    ...mapState('node', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.editingComponentSetId]
    }
  },
  watch: {
    editingComponentSetId(id) {
      if (id) {
        this.artBoardResizing(false)
      }
    }
  },
  methods: {
    ...mapActions('app', ['artBoardResizing']),
    onScroll: updateWrapperStyle
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
