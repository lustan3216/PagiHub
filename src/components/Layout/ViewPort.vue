<template>
  <div
    v-free-view="freeViewOptions"
    class="p-15"
  >
    <div ref="target">
      <slot />
    </div>
    <portal to="TopNav">
      <el-button
        size="small"
        @click="scaleRollback"
      >
        {{ scalePercent }} %
      </el-button>
    </portal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DialogInteracted from '@/components/Components/DialogInteracted'
import ViewPortCover from './ViewPortCover'
import { directive } from '@/directive/freeView'

export default {
  name: 'ViewPort',
  components: {
    DialogInteracted,
    ViewPortCover
  },
  directives: {
    FreeView: directive
  },
  data() {
    return {
      scaleRatio: 1,
      canvasWidth: 0,
      freeViewOptions: {
        move: false,
        scaleCallback: this.scaleCallback,
        targetSelector: '.free-view-target'
      }
    }
  },
  computed: {
    ...mapState('mode', ['mode']),
    scalePercent() {
      return Math.ceil(+this.scaleRatio * 100)
    },
    targetEl() {
      return this.$refs.target
    }
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    }),
    scaleRollback() {
      this.targetEl.style.webkitTransform = this.targetEl.style.transform = null
      this.scaleRatio = 1
      this.appSET({ scaleRatio: 1 })
      this.freeViewOptions.freeViewReset()
    },
    scaleCallback(event, { scaleRatio }) {
      this.appSET({ scaleRatio })
      this.scaleRatio = scaleRatio
    }
  }
}
</script>
