<template>
  <browser-window>
    <component v-if="rootNode" :id="rootNode.id" :is="rootNode.tag" />
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
