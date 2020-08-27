<template>
  <layers>
    <component
      :id="rootNode.id"
      :is="rootNode.tag"
    />
    <portal-target name="Root" />
  </layers>
</template>

<script>
import { mapGetters } from 'vuex'
import Layers from '../Templates/Layers'

export default {
  name: 'PanelProduction',
  components: {
    Layers
  },
  computed: {
    ...mapGetters('node', ['rootNode'])
  }
}
</script>
