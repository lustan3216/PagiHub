<template>
  <component :is="outer">
    <component v-if="rootNode" :id="rootNode.id" :is="rootNode.tag" />
  </component>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import BrowserWindow from '../BrowserWindow'
import Layers from './Layers'

export default {
  name: 'BoardRoot',
  components: {
    BrowserWindow,
    Layers
  },
  computed: {
    ...mapState('app', ['mode']),
    ...mapGetters('nodes', ['rootNode']),
    outer() {
      return this.mode === 'carousel' ? 'div' : 'browser-window'
    }
  },
  created() {
    this.getRootNode()
  },
  methods: {
    ...mapActions('nodes', ['getRootNode'])
  }
}
</script>
