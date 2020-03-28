<template>
  <div v-zoom="callback" class="browser">
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
import zoom from '../../directives/zoom'
import { mapMutations } from 'vuex'
import interactjs from 'interactjs'
import { isMac } from '../../utils/check'
export default {
  name: 'Browser',
  directives: {
    zoom
  },
  data() {
    return {
      callback: scaleRatio => {
        this.$el.style.transform = `scale(${scaleRatio.toFixed(2)})`

        this.appSET({ scaleRatio: scaleRatio.toFixed(2) })
      }
    }
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    }),
    isMac
  }
}
</script>

<style scoped lang="scss">
.browser {
  position: relative;
  min-height: 100%;
  @include calc-vh(min-height, '100vh - 20px');
  box-shadow: 0 5px 20px 0 rgba(32, 48, 60, 0.11);
  border-radius: 5px;
  background-color: #fff;
  overflow: hidden;
}
</style>
