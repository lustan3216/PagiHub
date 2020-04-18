<template>
  <view-port>
    <layers-root
      v-if="rootNode"
      :id="rootNode.id"
    />
  </view-port>
</template>

<script>
import { mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import LayersRoot from '../Templates/LayersRoot'
import { isMac } from '../../utils/device'

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    LayersRoot
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
