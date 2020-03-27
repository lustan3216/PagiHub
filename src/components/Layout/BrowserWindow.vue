<template>
  <div v-zoom="callback" class="browser" >
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
        this.$el.style.transform = `scale(${scaleRatio})`
        
        this.appSET({ scaleRatio: scaleRatio })
      }
    }
  },
  mounted() {
    interactjs(this.$el).resizable({
      edges: {
        bottom: true,
        right: true
      }
    }).on('resizemove', event => {
      let { x, y } = event.target.dataset
  
      x = parseFloat(x) || 0
      y = parseFloat(y) || 0
  
      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
        transform: `translate(${event.deltaRect.left}px, ${event.deltaRect.top}px)`
      })
  
      Object.assign(event.target.dataset, { x, y })
    })
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
