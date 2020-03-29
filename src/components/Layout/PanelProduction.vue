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
  provide() {
    return {
      isEditable: false
    }
  },
  computed: {
    ...mapGetters('nodes', ['rootNode'])
  }
}
</script>
