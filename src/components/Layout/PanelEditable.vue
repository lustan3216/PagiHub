<template>
  <view-port class="class">
    <component
      v-if="rootNode"
      :id="rootNode.id"
      :is="rootNode.tag"
      class="ignoreDrag"
    />
    <portal-target name="Root" />
  </view-port>
</template>

<script>
import { mapGetters } from 'vuex'
import ViewPort from './ViewPort'
import Layers from '../Templates/Layers'

export default {
  name: 'PanelEditable',
  components: {
    ViewPort,
    Layers
  },
  provide() {
    return {
      isEditable: true
    }
  },
  computed: {
    ...mapGetters('nodes', ['rootNode'])
  }
}
</script>

<style lang="scss" scoped>
  .class {
    @include calc-vh(height, '100vh - 60px');
  }
</style>
