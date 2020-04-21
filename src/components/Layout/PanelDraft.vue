<template>
  <view-port>
    <layersInteract
      v-if="rootNode"
      :id="rootNode.id"
      class="panel-draft"
    />
  </view-port>
</template>

<script>
import { mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import LayersInteract from '../Templates/LayersInteract'
import { isMac } from '@/utils/device'

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    LayersInteract
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  },
  beforeCreate() {
    this.$store.dispatch('project/getProjects')
  },
  methods: {
    isMac
  }
}
</script>

<style scoped lang="scss">
.panel-draft {
  overflow: auto;
  box-sizing: border-box;
  padding: 1px;
}
</style>
