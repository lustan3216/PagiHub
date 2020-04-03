<template>
  <div>
    <component :id="rootNode.id" :is="rootNode.tag" />
    <portal-target name="Root" />
  </div>
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
    ...mapGetters('draft', ['rootNode'])
  }
}
</script>
