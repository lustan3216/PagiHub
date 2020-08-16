<template>
  <div
    v-if="editingComponentSetId"
    id="art-board"
    :id="editingComponentSetId"
    class="art-board"
    @scroll="onScroll"
  >
    <component-set :id="editingComponentSetId" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ComponentSet from '../TemplateUtils/ComponentSet'

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
  data() {
    return {
      canvasWidth: 0
    }
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    ...mapState('component', ['editingComponentSetId']),
    node() {
      return this.componentsMap[this.editingComponentSetId]
    }
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    }),
    ...mapActions('app', ['resizeNodeQuickFn']),
    onScroll() {
      this.APP_SET({ windowResizing: true })
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.APP_SET({ windowResizing: false })
        this.resizeNodeQuickFn()
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
