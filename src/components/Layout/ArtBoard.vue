<template>
  <!--  padding: 1px; 很重要，因為grid item -1px, 如果item貼齊上邊，會因為上面看不到虛線下面看得到虛線-->
  <div
    id="art-board"
    :style="{
      padding: isDraftMode ? '1px' : false
    }"
    class="art-board"
    @scroll="onScroll"
  >
    <transition
      name="slide"
      mode="out-in"
    >
      <component-set
        v-if="editingComponentSetId"
        :id="editingComponentSetId"
        :key="editingComponentSetId"
      />
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
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
