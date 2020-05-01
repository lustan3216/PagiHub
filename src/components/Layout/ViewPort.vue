<template>
  <div v-free-view="{ move: false, scaleCallback }">
    <view-port-cover
      v-if="$refs.browser"
      :target="$refs.browser.$el"
      :class="{ interact: isDraftMode }"
    />

    <dialog-interacted
      ref="browser"
      :scale-ratio="scaleRatio"
      :class="{ interact: isDraftMode }"
      :resize-options="{ ignoreFrom: '.vue-grid-item' }"
      :drag-options="{ ignoreFrom: '.vue-grid-item' }"
      :draggable="false"
      @resize="dialogResize"
      @resizeStart="appSET({ isAnimating: true })"
      @resizeEnd="appSET({ isAnimating: false })"
      @dragstart="appSET({ isAnimating: true })"
      @dragEnd="appSET({ isAnimating: false })"
    >
      <slot />
    </dialog-interacted>

    <portal to="ViewPort">
      <el-dropdown
        split-button
        size="small"
        @click="canvasWidthRollback"
        @command="canvasWidthChange"
      >
        <!--    need to reduce 4 pixel for border    -->
        {{ isCustom ? `${canvasWidth - 4} px` : current }}

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
      canvasWidth: 0
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
      this.$el.style.webkitTransform = this.$el.style.transform = null
      this.scaleRatio = 1
      this.canvasWidthReset()
    },
    canvasWidthReset() {
      const browser = this.$refs.browser
      this.canvasWidth = browser.$el.clientWidth
      browser.reset()
    },
    canvasWidthChange(command) {
      // 4 pixel because border
      const pixel = parseInt(command) - 4

      this.option = command

      this.$refs.browser.$el.style.width = pixel ? `${pixel}px` : null
      this.canvasWidthReset()
    },
    canvasWidthRollback() {
      this.$refs.browser.$el.style.width = null
      this.canvasWidthReset()
    },
    scaleCallback(event, { scaleRatio }) {
      this.appSET({ scaleRatio })
      this.scaleRatio = scaleRatio
    }
  }
}
</script>

<style scoped lang="scss">
.interact {
  box-shadow: 0 0 15px 0 rgba(32, 48, 60, 0.11);
  box-sizing: border-box;
  background: transparent;
  top: 15px;
  left: 15px;
  width: calc(100vw - 390px);
  @include calc-vh(height, '100vh - 30px');
  position: absolute;
}
</style>
