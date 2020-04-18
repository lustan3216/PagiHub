<template>
  <layers-root>
    <component
      :id="rootNode.id"
      :is="rootNode.tag"
    />
    <portal-target name="Root" />
  </layers-root>
</template>

<script>
import { mapGetters } from 'vuex'
import LayersRoot from '../Templates/LayersRoot'

export default {
  name: 'PanelProduction',
  components: {
    LayersRoot
  },
  computed: {
    ...mapGetters('draft', ['rootNode'])
  }
}
</script>
