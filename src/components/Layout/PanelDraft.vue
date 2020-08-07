<template>
  <view-port>
    <dialog-interacted
      :draggable="false"
      @resizeEnd="resizeNodeQuickFn"
    >
      <art-board
        v-if="editingComponentSetId"
        ref="artBoard"
        :id="editingComponentSetId"
        :key="editingComponentSetId"
        @scroll.native="onScroll"
      />
    </dialog-interacted>
  </view-port>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import { isMac } from '@/utils/device'
import ComponentSet from '../TemplateUtils/ComponentSet'
import DialogInteracted from '@/components/Components/DialogInteracted'

let timer = null

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    ComponentSet,
    DialogInteracted
  },
  computed: {
    ...mapState('component', ['editingComponentSetId'])
  },
  created() {
    if (this.$route.params.projectId) {
      this.getProject(this.$route.params.projectId).then(project => {
        if (!project) {
          this.$router.push('/projects')
        }
      })
    }

    this.initExamples()
    window.addEventListener('resize', this.setProductionIfWindowSmall)
  },
  methods: {
    ...mapActions('app', ['resizeNodeQuickFn']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('component', ['patchComponentSet', 'getProject']),
    ...mapMutations('mode', ['SET_PRODUCTION_MODE', 'SET_DRAFT_MODE']),
    isMac,
    setProductionIfWindowSmall() {
      if (window.innerWidth < 992) {
        this.SET_PRODUCTION_MODE()
      } else {
        this.SET_DRAFT_MODE()
      }
      this.resizeNodeQuickFn()
    },
    onScroll() {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.resizeNodeQuickFn()
      }, 50)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.vue-grid-item > .vue-resizable-handle {
  bottom: -10px;
  right: -10px;
}
.interact-board {
  overflow: scroll;
  background-color: #fff;
  @include calc-vh('height', '100vh - 80px');
}
</style>
