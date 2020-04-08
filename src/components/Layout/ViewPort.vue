<template>
  <div>
    <div v-mousewheel="callback">
      <dialog-interacted
        ref="browser"
        :scale-ratio="scaleRatio"
        :class="{ interact: isDraftMode }"
        :resize-options="{ ignoreFrom: '.vue-grid-item' }"
        :drag-options="{ ignoreFrom: '.vue-grid-item' }"
        :draggable="isDraftMode"
        @resize="dialogResize"
        @resizeStart="appSET({ isAnimating: true })"
        @resizeEnd="appSET({ isAnimating: false })"
        @dragstart="appSET({ isAnimating: true })"
        @dragEnd="appSET({ isAnimating: false })"
      >
        <slot />
      </dialog-interacted>
    </div>

    <portal to="view-port-controller">
      <el-dropdown
        split-button
        size="small"
        @click="canvasWidthRollback"
        @command="canvasWidthChange"
      >
        {{ isCustom ? `${canvasWidth} px` : current }}

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in options"
            :key="option"
            :command="option"
          >
            {{ option }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

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
import DialogInteracted from '../Components/DialogInteracted'
import mousewheel from 'element-ui/lib/directives/mousewheel'

export default {
  name: 'ViewPort',
  directives: {
    mousewheel
  },
  components: {
    DialogInteracted
  },
  data() {
    const options = [
      'Custom',
      '1920px Computer',
      '1200px Computer',
      '996px  Computer',
      '768px  Tablet',
      '320px  Mobile'
    ]

    return {
      current: options[0],
      options,
      scaleRatio: 1,
      canvasWidth: 0,
      callback: (event, { pixelX, pixelY }) => {
        if (event.ctrlKey) {
          event.preventDefault()

          let scaleRatio = this.scaleRatio + pixelY * -0.008
          scaleRatio = Math.min(Math.max(0.5, scaleRatio), 1.25)

          this.$el.style.transform = `scale(${scaleRatio.toFixed(2)})`
          this.appSET({ scaleRatio })
          this.scaleRatio = scaleRatio
        }
      }
    }
  },
  computed: {
    ...mapState('mode', ['mode']),
    scalePercent() {
      return Math.ceil(+this.scaleRatio * 100)
    },
    isCustom() {
      return this.options[0] === this.current
    }
  },
  watch: {
    mode() {
      this.$nextTick(() => {
        this.canvasWidthRollback()
      })
    }
  },
  mounted() {
    this.canvasWidthReset()
  },
  methods: {
    ...mapMutations('app', {
      appSET: 'SET'
    }),
    dialogResize(event) {
      this.canvasWidth = +event.target.clientWidth.toFixed()
    },
    scaleRollback() {
      this.$el.style.transform = null
      this.scaleRatio = 1
      this.canvasWidthReset()
    },
    canvasWidthReset() {
      const browser = this.$refs.browser
      this.canvasWidth = browser.$el.clientWidth
      browser.reset()
    },
    canvasWidthChange(command) {
      const pixel = parseInt(command)

      this.option = command

      this.$refs.browser.$el.style.width = pixel ? `${pixel}px` : null
      this.canvasWidthReset()
    },
    canvasWidthRollback() {
      this.$refs.browser.$el.style.width = null
      this.canvasWidthReset()
    }
  }
}
</script>

<style scoped lang="scss">
.interact {
  top: 45px;
  box-shadow: 0 5px 20px 0 rgba(32, 48, 60, 0.11);
  border: 10px solid transparent;
  background: transparent;
  width: calc(100vw - 330px);
  @include calc-vh(height, '100vh - 70px');
  overflow-y: scroll;
  position: absolute;
  overflow-x: hidden;
}
.dragger {
  font-size: 18px;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100000;
}
</style>
