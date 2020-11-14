<template>
  <div
    v-free-view="freeViewOptions"
    id="view-port"
    :class="{ resizeBar }"
    class="fake-transform view-port"
  >
    <!--   這層雖然多餘，但為了要限制 interact 的 size grab bar 被拉出去  -->
    <!--  interactjs.modifiers.restrictEdges({ outer: 'parent' })  -->
    <div class="h-100">
      <div
        ref="target"
        :style="{
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${style.scale})`,
          height: style.h ? style.h +'px' :'100%',
          width: style.w ? style.w +'px' : undefined
        }"
        class="target free-view-target"
      >
        <template v-if="resizeBar">
          <div
            class="handler top"
            @mousedown="handlerStart('moveTop')"
          />
          <div
            class="handler right"
            @mousedown="handlerStart('moveRight')"
          />
          <div
            class="handler bottom"
            @mousedown="handlerStart('moveBottom')"
          />
          <div
            class="handler left"
            @mousedown="handlerStart('moveLeft')"
          />
        </template>
        <slot />
      </div>
    </div>

    <portal to="ViewPortController">
      <div class="align-center">
        <el-tooltip
          v-if="isPreviewMode"
          content="Hide Resize bar"
          effect="light"
          placement="bottom"
        >
          <el-button
            :type="resizeBar ? 'primary' : 'text'"
            icon="el-icon-full-screen"
            class="shortcut-button"
            plain
            @click="hideResizeBar"
          />
        </el-tooltip>

        <button-device
          v-for="point in descBreakpoints"
          :key="point"
          :point-key="point"
          @click="setSize({ w: $event })"
        />

        <el-popover
          placement="bottom"
          width="280"
          trigger="click"
        >
          <setting-breakpoints v-if="descBreakpoints.length" />

          <el-button
            slot="reference"
            class="p-10"
            type="text"
            icon="el-icon-more-outline"
          />
        </el-popover>

        <el-divider direction="vertical" />

        <select-devices-screen
          :width="style.w"
          :height="style.h"
          @buttonClick="setBoundaryRect"
          @itemClick="setSize({ w: $event.w, h: $event.h })"
        />

        <el-button
          size="small"
          icon="el-icon-refresh-left"
          @click="style.scale = 1"
        >
          {{ scalePercent }} %
        </el-button>
      </div>
    </portal>
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { Popover } from 'element-ui'
import SettingBreakpoints from '../Setup/EditorSetting/SettingBreakpoints'
import ButtonDevice from '../Components/ButtonDevice'
import SelectDevicesScreen from '../Components/SelectDevicesScreen'
import { directive } from '@/directive/freeView'
import { getRectWithoutPadding } from '@/utils/style'
import { globalDebounce } from '@/utils/tool'

export default {
  name: 'ViewPort',
  components: {
    SettingBreakpoints,
    ButtonDevice,
    ElPopover: Popover,
    SelectDevicesScreen
  },
  directives: {
    FreeView: directive
  },
  data() {
    return {
      resizeBar: true,
      freeViewOptions: {
        move: false,
        scaleCallback: this.scaleCallback,
        targetSelector: '.free-view-target'
      },
      moveTop: false,
      moveLeft: false,
      moveRight: false,
      moveBottom: false,
      style: {
        h: 0,
        w: 0,
        scale: 1
      }
    }
  },
  computed: {
    ...mapState('layout', ['windowWidth', 'windowHeight']),
    ...mapGetters('layout', ['descBreakpoints']),
    ...mapState('mode', ['mode']),
    scalePercent() {
      return Math.ceil(+this.style.scale * 100)
    },
    targetEl() {
      return this.$refs.target
    },
    interact() {
      return interactjs(this.targetEl)
    }
  },
  watch: {
    mode() {
      this.setBoundaryRect()
      this.reset()
    },
    resizeBar(value) {
      if (value && this.style.w === this.windowWidth) {
        this.$nextTick(() => {
          this.setBoundaryRect()
        })
      }
    },
    isDraftMode(value) {
      if (value) {
        this.resizeBar = true
      }
    },
    'style.scale'(scaleRatio) {
      this.LAYOUT_SET({ scaleRatio })
    }
  },
  mounted() {
    let lastPositionX
    let lastPositionY
    this.interact.resizable({
      edges: {
        left: '.handler.left',
        right: '.handler.right',
        bottom: '.handler.bottom',
        top: '.handler.top'
      },
      listeners: {
        start: event => {
          lastPositionX = event.client.x
          lastPositionY = event.client.y
          this.LAYOUT_SET({ gridResizing: true })
        },
        move: event => {
          const { scale } = this.style

          const deltaX =
            this.moveLeft || this.moveRight
              ? (event.client.x - lastPositionX) * 2
              : 0
          const deltaY =
            this.moveTop || this.moveBottom
              ? (event.client.y - lastPositionY) * 2
              : 0

          const h = this.style.h + (this.moveTop ? -deltaY : deltaY) / scale
          const w = this.style.w + (this.moveLeft ? -deltaX : deltaX) / scale

          lastPositionX = event.client.x
          lastPositionY = event.client.y
          Object.assign(this.style, {
            h: parseInt(h),
            w: parseInt(w),
            scale
          })

          this.$emit('resize', event)
        },
        end: event => {
          lastPositionX = null
          lastPositionY = null
          this.LAYOUT_SET({ gridResizing: false })
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interactjs.modifiers.restrictEdges({
          outer: 'parent'
        })
      ],

      inertia: false
    })

    this.$nextTick(() => {
      this.reset()
    })
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    hideResizeBar() {
      this.resizeBar = !this.resizeBar
      this.$nextTick(() => {
        this.setBoundaryRect()
      })
    },
    reset() {
      this.setBoundaryRect()
      this.style.scale = 1
      this.$bus.$emit('operator-get-rect')
    },
    setBoundaryRect() {
      const { height, width } = getRectWithoutPadding(this.$el)
      this.$bus.$emit('operator-get-rect')
      this.style.w = width
      this.style.h = height
    },
    scaleCallback(event, { scaleRatio }) {
      this.LAYOUT_SET({ gridResizing: true })
      this.style.scale = scaleRatio

      globalDebounce(() => {
        this.LAYOUT_SET({ gridResizing: false })
      }, 50)
    },
    setSize({ w, h }) {
      const { width, height } = getRectWithoutPadding(this.$el)
      h = h || height

      if (w > width || h > height) {
        if (w / width > h / height) {
          this.style.scale = width / w
        }
        else {
          this.style.scale = height / h
        }
      }
      this.style.w = w
      this.style.h = h
      this.$bus.$emit('operator-get-rect')
    },
    handlerStart(position) {
      this.moveTop = false
      this.moveLeft = false
      this.moveRight = false
      this.moveBottom = false
      this[position] = true
    }
  }
}
</script>

<style scoped lang="scss">
.handler {
  position: absolute;
  opacity: 0.7;
  transition: opacity 1s;
  background-color: rgba(169, 172, 179, 0.49);
  border-radius: 3px;

  &:hover {
    opacity: 1;
    background-color: rgba(169, 172, 179, 0.49);
  }
}
.top {
  top: -12px;
  left: 40%;
  right: 40%;
  height: 8px;
}
.right {
  top: 40%;
  bottom: 40%;
  right: -12px;
  width: 8px;
}
.bottom {
  left: 40%;
  bottom: -12px;
  right: 40%;
  height: 8px;
}
.left {
  top: 40%;
  left: -12px;
  bottom: 40%;
  width: 8px;
}
.target {
  box-sizing: border-box;
  touch-action: none;
  position: relative;
  backface-visibility: hidden;
}

.shortcut-button {
  font-size: 16px;
  padding: 7px;
  margin: 5px 10px;
}

.view-port {
  overflow: hidden;
  position: relative;
  @include calc-vh('height', '100vh - 30px');

  &:not(.resizeBar) {
    @include calc-vh('height', '100vh');
  }
  &.resizeBar {
    padding: 15px;
  }
  &.draft {
    @include calc-vh('height', '100vh - 75px');
  }
}

::v-deep.el-dropdown {
  margin-right: 10px;
  margin-left: 10px;
}

.el-button,
::v-deep .el-button {
  border: none;
  padding: 9px;
}
</style>
