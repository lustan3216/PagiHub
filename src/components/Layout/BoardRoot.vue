<template>
  <browser-window>
    <component
      v-if="rootNode"
      :id="rootNode.id"
      :is="rootNode.tag"
      class="fake-transform root-node"
    />
  </browser-window>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BrowserWindow from './BrowserWindow'
import Layers from '../Templates/Layers'

export default {
  name: 'BoardRoot',
  components: {
    BrowserWindow,
    Layers
  },
  computed: {
    ...mapGetters('nodes', ['rootNode'])
  },
  created() {
    this.getRootNode()
  },
  methods: {
    ...mapActions('nodes', ['getRootNode'])
  }
}
</script>

<style scoped lang="scss">
.root-node {
  @include calc-vh(min-height, '100vh - 70px');
}
</style>
