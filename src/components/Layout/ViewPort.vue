<template>
  <div
    v-free-view="freeViewOptions"
    id="view-port"
    :class="{ resizeBar, draft: isDraftMode }"
    class="fake-transform view-port"
  >
    <!--   這層雖然多餘，但為了要限制 interact 的 size grab bar 被拉出去  -->
    <!--  interactjs.modifiers.restrictEdges({ outer: 'parent' })  -->
    <div class="h-100">
      <div
        ref="target"
        class="target free-view-target"
        style="height: 100%;"
      >
        <template v-if="resizeBar">
          <div class="handler top" />
          <div class="handler right" />
          <div class="handler bottom" />
          <div class="handler left" />
        </template>
        <slot />
      </div>
    </div>

    <portal to="ViewPortController">
      <div class="align-center">
        <el-divider direction="vertical" />

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
            @click="resizeBar = !resizeBar"
          />
        </el-tooltip>

        <button-device
          v-for="point in breakpoints"
          v-if="point !== 'xs'"
          :key="point"
          :point-key="point"
          @click="setSize({ w: $event })"
        />

        <el-popover
          placement="bottom"
          width="280"
          trigger="click"
        >
          <setting-breakpoints v-if="breakpoints && breakpoints.length" />

          <el-button
            slot="reference"
            class="m-r-10 m-l-15"
            type="text"
            icon="el-icon-more-outline"
          />
        </el-popover>

        <el-divider direction="vertical" />

        <el-dropdown
          size="small"
          split-button
          type
          @click="setBoundaryRect"
        >
          <i class="el-icon-refresh-left" />
          <span
            class="grey-font"
            style="width: 75px; display: inline-block;"
          >
            {{ artBoardWidth }} x {{ artBoardHeight }}
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="option in deviceOptions"
              :key="option.name"
              :value="option.name"
              @click.native="setSize({ w: option.w, h: option.h })"
            >
              <div class="justify-between">
                <span class="grey-font">{{ option.name }}</span>
                <span
                  class="m-l-15 grey-font"
                >{{ option.w }} X {{ option.h }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

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
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { Popover } from 'element-ui'
import SettingBreakpoints from '../Setup/EditorSetting/SettingBreakpoints'
import ButtonDevice from '../Components/ButtonDevice'
import { directive } from '@/directive/freeView'
import { getRectWithoutPadding } from '@/utils/style'
import { toPrecision } from '@/utils/number'
import gsap from 'gsap'

export default {
  name: 'ViewPort',
  components: {
    SettingBreakpoints,
    ButtonDevice,
    ElPopover: Popover
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
      style: {
        h: 0,
        w: 0,
        scale: 1
      }
    }
  },
  computed: {
    ...mapState('mode', ['mode']),
    ...mapState('layout', ['artBoardWidth', 'artBoardHeight']),
    ...mapGetters('layout', ['breakpoints']),
    scalePercent() {
      return Math.ceil(+this.style.scale * 100)
    },
    targetEl() {
      return this.$refs.target
    },
    interact() {
      return interactjs(this.targetEl)
    },
    deviceOptions() {
      return [
        { name: 'iMac', w: 2560, h: 1440 },
        { name: 'MaxBook Pro', w: 1440, h: 900 },
        { name: 'Surface Pro 4', w: 1368, h: 912 },
        { name: 'Surface Pro 3', w: 1440, h: 960 },
        { name: 'iPhone 11 Pro Max', w: 414, h: 896 },
        { name: 'iPhone 11 Pro', w: 375, h: 812 },
        { name: 'iPhone 11', w: 414, h: 896 },
        { name: 'iPhone 8 Plus', w: 414, h: 736 },
        { name: 'iPhone 8', w: 375, h: 667 },
        { name: 'iPhone 8 SE', w: 320, h: 568 },
        { name: 'Google Pixel 4 XL', w: 360, h: 760 },
        { name: 'Google Pixel 4', w: 360, h: 769 },
        { name: 'Google Pixel 3 XL', w: 411, h: 846 },
        { name: 'Google Pixel 3', w: 411, h: 822 },
        { name: 'iPad Pro 12.9"', w: 1024, h: 1366 },
        { name: 'iPad Pro 11"', w: 834, h: 1194 },
        { name: 'iPad Air 10.5"', w: 834, h: 1112 },
        { name: 'iPad 10.2"', w: 810, h: 1080 },
        { name: 'iPad Mini', w: 768, h: 1024 }
      ]
    }
  },
  watch: {
    artBoardHeight(value) {
      this.style.h = value
    },
    artBoardWidth(value) {
      this.style.w = value
    },
    isDraftMode(value) {
      if (value) {
        this.resizeBar = true
      }
    },
    style: {
      handler(style) {
        const { LAYOUT_SET } = this
        gsap.to(this.targetEl, {
          height: style.h,
          width: style.w,
          x: '-50%',
          y: '-50%',
          z: 0,
          scale: style.scale,
          top: '50%',
          left: '50%',
          onStart: () => {
            LAYOUT_SET({ gridResizing: true })
          },
          onComplete: () => {
            LAYOUT_SET({ gridResizing: false })
          }
        })

        this.resizeNodeQuickFn()
        this.LAYOUT_SET({
          artBoardWidth: toPrecision(style.w, 0),
          artBoardHeight: toPrecision(style.h, 0)
        })
      },
      deep: true
    },
    'style.scale'(scaleRatio) {
      this.LAYOUT_SET({ scaleRatio })
    }
  },
  mounted() {
    this.interact.resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      allowFrom: '.handler.top, .handler.bottom, .handler.right, .handler.left',
      listeners: {
        move: event => {
          const { scale } = this.style

          const h = (event.rect.height + event.deltaRect.top) / scale
          const w = (event.rect.width + event.deltaRect.left) / scale

          Object.assign(this.style, {
            h,
            w,
            scale
          })

          this.$emit('resize', event)
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interactjs.modifiers.restrictEdges({
          outer: 'parent'
        })
      ],

      inertia: true,
      ...this.resizeOptions
    })
  },
  methods: {
    ...mapMutations('layout', {
      LAYOUT_SET: 'SET'
    }),
    ...mapActions('layout', ['checkIsGridResizing', 'resizeNodeQuickFn']),
    setBoundaryRect() {
      const { height, width } = getRectWithoutPadding(this.$el)

      this.style.w = width
      this.style.h = height
    },
    scaleCallback(event, { scaleRatio }) {
      this.style.scale = scaleRatio
    },
    setSize({ w, h }) {
      const { width, height } = getRectWithoutPadding(this.$el)
      h = h || height

      if (w > width || h > height) {
        if (w - width > h - height) {
          this.style.scale = width / w
        }
        else {
          this.style.scale = height / h
        }
      }
      this.style.w = w
      this.style.h = h
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
    @include calc-vh('height', '100vh - 80px');
  }
}

.el-dropdown {
  margin-right: 10px;
  margin-left: 10px;
}
</style>
