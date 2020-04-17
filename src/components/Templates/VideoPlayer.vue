<template>
  <vue-plyr
    :options="innerProps"
    @mouseleave="mouseleave"
  >
    <div
      data-plyr-provider="youtube"
      data-plyr-embed-id="bTqVqk7FSmY"
    />
  </vue-plyr>
</template>

<script>
import nodeMixin from './mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/VideoPlayer'
import VuePlyr from 'vue-plyr'

export default {
  defaultSetting,
  name: 'VideoPlayer',
  components: {
    VuePlyr
  },
  mixins: [nodeMixin],
  computed: {
    player() {
      return this.$refs.plyr.player
    }
  },
  methods: {
    mouseleave() {
      this.player.pause()
    }
  }
}
</script>
