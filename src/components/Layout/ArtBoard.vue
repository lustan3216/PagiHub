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
    <component-set
      v-if="editingComponentSetId"
      :id="editingComponentSetId"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ComponentSet from '../TemplateUtils/ComponentSet'

let timer = null
export default {
  name: 'ArtBoard',
  components: {
    DialogInteracted,
    ComponentSet
  },
  provide() {
    return {
      rootComponentSetId: this.id
    }
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    ...mapState('component', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.editingComponentSetId]
    }
  },
  mounted() {
    this.artBoardResizing(false)
  },
  methods: {
    ...mapActions('app', ['artBoardResizing']),
    onScroll() {
      this.artBoardResizing(true)
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.artBoardResizing(false)
      }, 100)
    }
  }
}
</script>

<style scoped lang="scss">
.art-board {
  overflow: scroll;
  background-color: #fff;
  @include calc-vh('height', '100vh - 80px');
}
</style>
