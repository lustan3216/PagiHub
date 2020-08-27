<template>
  <view-port class="view-port interact-view">
    <art-board />
  </view-port>
</template>

<script>
import { mapActions } from 'vuex'
import ViewPort from './ViewPort'
import ArtBoard from './ArtBoard'
import ComponentSet from '../Templates/ComponentSet'

export default {
  name: 'PanelDraft',
  components: {
    ArtBoard,
    ViewPort,
    ComponentSet,
    PanelDraft: () => import('@/components/Layout/PanelDraft')
  },
  created() {
    // if (this.$route.params.projectId) {
    //   this.getProject(this.$route.params.projectId).then(project => {
    //     if (project) {
    //       this.getAssets()
    //       this.initExamples()
    //     }
    //     else {
    //       this.$router.push('/projects')
    //     }
    //   })
    // }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.editor {
  @include calc-vh('height', '100vh - 50px');
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
.view-port {
  overflow: hidden;
  position: relative;
  flex: 1;
}
.interact-view {
  @include calc-vh('height', '100vh - 80px');
}
</style>
