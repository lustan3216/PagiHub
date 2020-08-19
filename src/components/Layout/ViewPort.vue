<template>
  <div
    v-free-view="freeViewOptions"
    class="fake-transform relative p-15"
  >
    <!--   這層雖然多餘，但為了要限制 interact 的 size grab bar 被拉出去  -->
    <!--  interactjs.modifiers.restrictEdges({ outer: 'parent' })  -->
    <div class="h-100">
      <div
        ref="target"
        class="target"
        style="height: 100%;"
      >
        <div class="handler top" />
        <div class="handler right" />
        <div class="handler bottom" />
        <div class="handler left" />
        <slot />
      </div>
    </div>

    <portal to="ViewPortController">
      <el-tooltip
        v-for="button in shortCutButtons"
        :content="`Set view port to ${button.w}px width`"
        :key="button.name"
        effect="light"
        placement="bottom"
      >
        <el-button
          :type="breakpoint === button.name ? 'primary' : 'text'"
          :class="button.class"
          :icon="button.icon"
          class="shortcut-button"
          plain
          @click="setSize({ w: button.w })"
        />
      </el-tooltip>

      <el-dropdown
        size="small"
        split-button
        type
        @click="reset"
      >
        <i class="el-icon-refresh-left" />
        <span class="grey-font">
          {{ artBoardWidth }} X {{ artBoardHeight }}
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
    </portal>

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
import interactjs from 'interactjs'
import { mapState, mapMutations, mapActions } from 'vuex'
import ViewPortCover from './ViewPortCover'
import { directive } from '@/directive/freeView'
import { BREAK_POINTS } from '@/const'

export default {
  name: 'ViewPort',
  components: {
    ViewPortCover
  },
  directives: {
    FreeView: directive
  },
  data() {
    return {
      scaleRatio: 1,
      freeViewOptions: {
        move: false,
        scaleCallback: this.scaleCallback,
        targetSelector: '.free-view-target'
      },
      height: 0,
      width: 0
    }
  },
  computed: {
    ...mapState('mode', ['mode']),
    ...mapState('app', ['breakpoint', 'artBoardWidth', 'artBoardHeight']),
    breakpoints() {
      return BREAK_POINTS
    },
    scalePercent() {
      return Math.ceil(+this.scaleRatio * 100)
    },
    targetEl() {
      return this.$refs.target
    },
    interact() {
      return interactjs(this.targetEl)
    },
    shortCutButtons() {
      return [
        { name: 'lg', w: this.breakpoints.lg, icon: 'el-icon-data-line' },
        { name: 'md', w: this.breakpoints.md, icon: 'el-icon-monitor' },
        { name: 'sm', w: this.breakpoints.sm, icon: 'el-icon-mobile' },
        {
          name: 'xs',
          w: this.breakpoints.xs,
          icon: 'el-icon-mobile-phone',
          class: 'rotate90'
        },
        {
          name: 'xxs',
          w: this.breakpoints.xxs,
          icon: 'el-icon-mobile-phone'
        }
      ]
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
  mounted() {
    this.interact
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        allowFrom:
          '.handler.top, .handler.bottom, .handler.right, .handler.left',
        listeners: {
          move: event => {
            const target = event.target

            const h = event.rect.height / this.scaleRatio
            const w = event.rect.width / this.scaleRatio

            this.height = parseInt(h)
            this.width = parseInt(w)

            let { x, y } = event.target.dataset

            x = parseFloat(x) || 0
            y = parseFloat(y) || 0
            x += event.deltaRect.left / this.scaleRatio
            y += event.deltaRect.top / this.scaleRatio

            Object.assign(target.style, {
              webkitTransform: `translate(${x}px, ${y}px)`,
              transform: `translate(${x}px, ${y}px)`,
              height: h + 'px',
              width: w + 'px'
            })

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)

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
      .on(['resizemove'], () => {
        this.artBoardResizing(true)
      })
      .on(['resizeend'], () => {
        this.artBoardResizing(false)
      })
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapActions('app', ['artBoardResizing']),
    scaleRollback() {
      this.targetEl.style.webkitTransform = this.targetEl.style.transform = null
      this.scaleRatio = 1
      this.APP_SET({ scaleRatio: 1 })
      this.freeViewOptions.freeViewReset()
    },
    scaleCallback(event, { scaleRatio }) {
      this.APP_SET({ scaleRatio })
      this.scaleRatio = scaleRatio
    },
    reset() {
      Object.assign(this.targetEl.style, {
        webkitTransform: null,
        transform: null,
        height: '100%',
        width: null
      })

      this.$el.setAttribute('data-x', 0)
      this.$el.setAttribute('data-y', 0)
      this.artBoardResizing(false)
    },
    setSize({ w, h }) {
      Object.assign(this.targetEl.style, {
        width: w + 'px',
        height: h ? h + 'px' : '100%'
      })
      this.artBoardResizing(false)
    }
  }
}
</script>

<style scoped lang="scss">
.handler {
  position: absolute;
  border-radius: 7px;
  opacity: 0;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
    background-color: rgba(169, 172, 179, 0.19);
  }
}
.top {
  top: -9px;
  left: 0;
  right: 0;
  height: 8px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.right {
  top: 0;
  bottom: 0;
  right: -9px;
  width: 8px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.bottom {
  left: 0;
  bottom: -9px;
  right: 0;
  height: 8px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}
.left {
  top: 0;
  left: -9px;
  bottom: 0;
  width: 8px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.target {
  box-sizing: border-box;
  touch-action: none;
  position: relative;
}

.shortcut-button {
  font-size: 16px;
  padding: 7px;
  margin: 5px 10px;
}
</style>
