<template>
  <div class="editor">
    <portal
      v-if="isDraftMode"
      to="nav-middle"
    >
      <function-bar />
    </portal>

    <sidebar-left v-if="isDraftMode" />

    <main class="flex1 relative over-hidden">
      <view-port>
        <dialog-interacted
          :min-height="567"
          :min-width="320"
          :draggable="false"
          @resize="resizing"
          @resizeEnd="resized"
        >
          <art-board ref="artBoard" />
        </dialog-interacted>
      </view-port>
    </main>

    <sidebar-right v-if="isDraftMode" />

    <portal-target
      name="TextEditorMenu"
      slim
    />
    <portal-target
      v-for="id in selectedComponentIds"
      :name="`PanelDraft-${id}`"
      :key="`PanelDraft-${id}`"
    />
  </div>
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
    DialogInteracted,
    SidebarRight: () => import('@/components/Layout/SidebarRight'),
    SidebarLeft: () => import('@/components/Layout/SidebarLeft'),
    FunctionBar: () => import('@/components/Layout/FunctionBar'),
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  computed: {
    ...mapState('app', ['selectedComponentIds'])
  },
  watch: {
    editingComponentSetId(value) {
      if (value) {
        this.checkBreakpoint()
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
    resizing() {
      this.APP_SET({ windowResizing: true })
      this.checkBreakpoint()
    },
    resized() {
      this.APP_SET({ windowResizing: false })
      this.resizeNodeQuickFn()
    },
    checkBreakpoint() {
      this.$nextTick(() => {
        const { clientWidth } = this.$refs.artBoard.$el
        const points = ['lg', 'md', 'sm', 'xs', 'xxs']

        this.APP_SET({
          breakpoint: points.find(key => clientWidth >= BREAK_POINTS[key]),
          artBoardWidth: parseInt(clientWidth)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.interact-board {
  overflow: scroll;
  background-color: #fff;
  @include calc-vh('height', '100vh - 80px');
}

.editor {
  @include calc-vh('height', '100vh - 50px');
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
</style>
