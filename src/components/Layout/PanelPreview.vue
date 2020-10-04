<template>
  <art-board
    v-if="editingComponentSetId"
    :id="editingComponentSetId"
  />
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ArtBoard from './ArtBoard'
import localforage from 'localforage'

export default {
  name: 'PanelProduction',
  components: {
    ArtBoard
  },
  async created() {
  },
  methods: {
    ...mapActions('layout', [''])
  }
}
</script>

<style scoped lang="scss">
.editor {
  display: flex;
  overflow: hidden;
  background-color: $color-grey;
}
.draft.editor {
  @include calc-vh('height', '100vh - 50px');
}
</style>
