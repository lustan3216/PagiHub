<template>
  <view-port>
    <dialog-interacted
      :draggable="false"
      class="interact-board"
    >
      <art-board
        v-if="editingComponentSetId"
        :id="editingComponentSetId"
        :key="editingComponentSetId"
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
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.item > .vue-resizable-handle {
  bottom: -10px;
  right: -10px;
}
.interact-board {
  background-color: #fff;
  @include calc-vh('min-height', '100vh - 80px');
}
</style>
