<template>
  <div
    :class="{ resizeBar }"
    class="fake-transform view-port"
  >
    <!--   這層雖然多餘，但為了要限制 interact 的 size grab bar 被拉出去  -->
    <!--  interactjs.modifiers.restrictEdges({ outer: 'parent' })  -->
    <div class="outer">
      <div
        id="example-view-port"
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
        <slot />
      </div>
    </div>

    <div
      v-if="controller"
      class="flex-center"
    >
      <button-device
        v-for="point in descBreakpoints"
        v-if="point !== 'xs'"
        :key="point"
        :active="findBreakpoint(point)"
        :point-key="point"
        @click="setSize({ w: $event })"
      />

      <el-divider direction="vertical" />

      <el-dropdown
        size="small"
        split-button
        type
        @click="setBoundaryRect"
      >
        <i class="el-icon-refresh-left" />
        <span
          class="gray-font font-12"
          style="width: 75px; display: inline-block;"
        >
          {{ style.w }} x {{ style.h }}
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="option in deviceOptions"
            :key="option.name"
            :value="option.name"
            @click.native="setSize({ w: option.w, h: option.h })"
          >
            <div class="justify-between">
              <span class="gray-font">{{ option.name }}</span>
              <span
                class="m-l-15 gray-font"
              >{{ option.w }} X {{ option.h }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import ButtonDevice from '../Components/ButtonDevice'
import { getRectWithoutPadding } from '@/utils/style'
import { findBreakpoint, sortDescBreakpoint } from '@/utils/layout'
import { DEVICE_OPTIONS } from '@/components/Layout/ViewPort'
import { resizeListener } from '@/utils/tool'

export default {
  name: 'ExampleViewPort',
  components: {
    ButtonDevice
  },
  provide() {
    return {
      exampleViewPort: this.style
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    resizeBar: {
      type: Boolean,
      default: true
    },
    controller: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      offResizeListener: null,
      style: {
        h: 0,
        w: 0,
        scale: 1
      }
    }
  },
  computed: {
    scalePercent() {
      return Math.ceil(+this.style.scale * 100)
    },
    targetEl() {
      return this.$refs.target
    },
    componentSet() {
      return this.nodesMap[this.id]
    },
    breakpointsMap() {
      if (this.componentSet) {
        return this.componentSet.breakpointsMap
      }
    },
    descBreakpoints() {
      const points = Object.keys(this.breakpointsMap)
      return sortDescBreakpoint(points)
    },
    deviceOptions() {
      return DEVICE_OPTIONS
    }
  },
  mounted() {
    const { clientHeight, clientWidth } = document.getElementById('example-view-port')
    this.style.h = clientHeight
    this.style.w = clientWidth

    this.offResizeListener = resizeListener(document.getElementById('example-view-port'), () => {
      const { clientHeight, clientWidth } = document.getElementById('example-view-port')
      this.style.h = clientHeight
      this.style.w = clientWidth
    })
  },
  beforeDestroy() {
    if (this.offResizeListener) {
      this.offResizeListener()
      this.offResizeListener = null
    }
  },
  methods: {
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    }),
    findBreakpoint(point) {
      return point === findBreakpoint(this.breakpointsMap, this.style.w)
    },
    setBoundaryRect() {
      const { height, width } = getRectWithoutPadding(this.targetEl.parentNode)
      this.style.scale = 1
      this.style.w = width
      this.style.h = height
      this.$bus.$emit('operator-get-rect')
    },
    setSize({ w, h }) {
      const { width, height } = getRectWithoutPadding(this.targetEl.parentNode)
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
    }
  }
}
</script>

<style scoped lang="scss">
.handler {
  position: absolute;
  opacity: 0.7;
  transition: opacity 1s;
  background-color: rgba(169, 172, 179, 0.19);
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
  box-shadow: rgba(0, 0, 0, 0.2) 0 2px 15px;
}

.shortcut-button {
  font-size: 16px;
  padding: 7px;
  margin: 5px 10px;
}

.view-port {
  overflow: hidden;
  position: relative;
  height: 100%;
  box-sizing: border-box;

  &.resizeBar {
    padding: 15px;
  }
}

.outer {
  height: 60vh;
  padding: 15px;
  border-radius: 3px;
  border: 1px solid $color-grey;
}
</style>
