<template>
  <div
    v-free-view="freeViewOptions"
    class="wh-100"
    @click="cleanEditingComponentSet"
  >
    <div
      ref="target"
      class="free-view-target"
    >
      <slot/>
    </div>
    <portal to="ViewPort">
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
        scaleCallback: this.scaleCallback,
        targetSelector: '.free-view-target',
        moveIgnoreSelector: '.selected.art-board'
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
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
    scaleRollback() {
      this.targetEl.style.webkitTransform = this.targetEl.style.transform = null
      this.scaleRatio = 1
      this.appSET({ scaleRatio: 1 })
      this.freeViewOptions.freeViewReset()
    },
    scaleCallback(event, { scaleRatio }) {
      this.appSET({ scaleRatio })
      this.scaleRatio = scaleRatio
    },
    cleanEditingComponentSet(event) {
      if (!event.target.dataset.id) {
        this.SET_EDITING_COMPONENT_SET_ID(null)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .free-view-target {
    padding: 40px 35px;
    width: 4000px;
  }
</style>
