<template>
  <view-port>
    <root-layers
      v-if="rootNode"
      :id="rootNode.id"
    />
    <portal-target name="Root" />
  </view-port>
</template>

<script>
import { mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import RootLayers from '../Templates/RootLayers'
import { isMac } from '../../utils/device'

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    RootLayers
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  },
  methods: {
    isMac
  }
}
</script>
