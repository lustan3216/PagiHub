<template>
  <view-port>
    <component v-if="rootNode" :id="rootNode.id" :is="rootNode.tag" />
    <portal-target name="Root" />
  </view-port>
</template>

<script>
import { mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import Layers from '../Templates/Layers'
import { isMac } from '../../utils/device'

export default {
  name: 'PanelDraft',
  components: {
    ViewPort,
    Layers
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  },
  methods: {
    isMac
  }
}
</script>
