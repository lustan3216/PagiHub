<template>
  <div
    ref="panelDraft"
    class="editor"
  >
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
          @resize="artBoardResizing(true)"
          @resizeEnd="artBoardResizing(false)"
        >
          <art-board />
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
import ComponentSet from '../TemplateUtils/ComponentSet'
import DialogInteracted from '@/components/Components/DialogInteracted'

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
      this.artBoardResizing(true)
    })
  },
  methods: {
    ...mapActions('app', ['artBoardResizing']),
    ...mapActions('example', ['initExamples']),
    ...mapActions('component', ['getProject'])
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
