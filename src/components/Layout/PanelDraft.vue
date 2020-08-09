<template>
  <view-port>
    <dialog-interacted
      :min-height="567"
      :min-width="320"
      :draggable="false"
      @resize="resizing"
      @resizeEnd="resized"
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
import { BREAK_POINTS } from '@/const'

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
  watch: {
    editingComponentSetId(value) {
      if (value) {
        this.$nextTick(() => {
          this.checkBreakpoint()
        })
      }
    }
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
    window.addEventListener('resize', () => {
      this.checkBreakpoint()
      this.setProductionIfWindowSmall()
    })
  },
  methods: {
    ...mapActions('app', ['resizeNodeQuickFn']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('component', ['patchComponentSet', 'getProject']),
    ...mapMutations('mode', ['SET_PRODUCTION_MODE', 'SET_DRAFT_MODE']),
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    isMac,
    setProductionIfWindowSmall() {
      if (window.innerWidth < 992) {
        this.SET_PRODUCTION_MODE()
      } else {
        this.SET_DRAFT_MODE()
      }

      this.APP_SET({ windowResizing: true })

      if (timer !== null) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        this.APP_SET({ windowResizing: false })
        this.resizeNodeQuickFn()
      }, 100)
    },
    onScroll() {
      this.APP_SET({ windowResizing: true })
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        this.APP_SET({ windowResizing: false })
        this.resizeNodeQuickFn()
      }, 100)
    },
    resizing() {
      this.APP_SET({ windowResizing: true })
      this.checkBreakpoint()
    },
    resized() {
      this.APP_SET({ windowResizing: false })
      this.resizeNodeQuickFn()
    },
    checkBreakpoint() {
      const { clientWidth } = this.$refs.artBoard.$el
      const points = ['lg', 'md', 'sm', 'xs', 'xxs']

      this.APP_SET({
        breakpoint: points.find(key => clientWidth >= BREAK_POINTS[key])
      })
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
