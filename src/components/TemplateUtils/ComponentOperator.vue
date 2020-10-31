<template>
  <div
    v-if="node && visible"
    :id="`quick-fn-${id}`"
    :style="styles"
    class="quick-functions flex-center"
  >
    <portal-target
      v-if="isTextEditor && itemEditing"
      :style="textEditorStyle"
      name="QuickFunctionsTextEditor"
      slim
      class="can-action"
    />

    <div class="wrapper flex top">
      <div
        v-if="isLastOne"
        class="flex"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >
        <div class="component-name">
          <transition-group
            name="full-slide"
            class="align-center"
          >
            <template v-for="(node, index) in nodesPath">
              <i
                v-if="hovering && index"
                :key="node.id + 'i'"
                class="el-icon-arrow-left"
              />
              <component-name
                v-if="hovering || node.id === id"
                :key="node.id"
                :id="node.id"
                :editable="false"
                :is-example="isExample"
                @click="SET_SELECTED_COMPONENT_ID(node.id)"
              >
                <i
                  v-if="node.id === id"
                  :class="[
                    itemEditing ? 'el-icon-edit-outline' : 'el-icon-rank'
                  ]"
                  class="m-l-5"
                />
              </component-name>
            </template>
          </transition-group>
        </div>
      </div>

      <often-use-menu
        v-if="isDraftMode && !isExample && isLastOne"
        :id="id"
        class="flex backface-hidden"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ComponentName from './ComponentName'
import { Popover } from 'element-ui'
import {
  isGrid,
  isBackground,
  isTextEditor,
  traversalAncestorAndSelf
} from '@/utils/node'
import { arrayLast } from '@/utils/array'
import { vmCreateEmptyItem } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import { debounce } from '@/utils/tool'
import { BIconPlusSquareFill } from 'bootstrap-vue'
import OftenUseMenu from './OftenUseMenu'

const topShared = window.innerHeight / 2
const leftShared = window.innerWidth / 2
const widthShared = 0
const heightShared = 0

export const quickFnMap = {}

if (process.env.NODE_ENV !== 'production') {
  window.quickFnMap = quickFnMap
}

let timeId

export default {
  name: 'ComponentOperator',
  components: {
    ComponentName,
    ElPopover: Popover,
    BIconPlusSquareFill,
    OftenUseMenu
  },
  props: {
    id: {
      type: String,
      required: true
    },
    isExample: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      top: topShared,
      left: leftShared,
      width: widthShared,
      height: heightShared,
      zIndex: this.isExample ? 2005 : 2000,
      animationId: null,
      canGoBack: null,
      hovering: false,
      visible: false
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'editingPath'
    ]),
    ...mapState('layout', ['gridResizing', 'windowHeight']),
    ...mapGetters('app', ['selectedComponentNodes']),
    styles() {
      return {
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        zIndex: this.zIndex
      }
    },
    itemEditing() {
      return this.editingPath.includes(this.id)
    },
    textEditorStyle() {
      const shouldOnLeftSide = this.width + this.left + 400 > window.innerWidth
      if (shouldOnLeftSide) {
        return { right: this.width + 10 + 'px' }
      }
      else {
        return { left: this.width + 10 + 'px' }
      }
    },
    nodesPath() {
      const nodes = []
      traversalAncestorAndSelf(this.node, node => {
        if (!isGrid(node)) {
          nodes.push(node)
        }

        return !isBackground(node)
      })
      return nodes.slice(0, 4)
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    node() {
      return this.nodesMap[this.id]
    },
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    isBackground() {
      return isBackground(this.node)
    },
    isButton() {
      return this.node.tag === 'flex-button'
    },
    isTextEditor() {
      return isTextEditor(this.node)
    }
  },
  mounted() {
    this.resize()
    this.$bus.$on('quick-function-resize', this.resize)
  },
  beforeDestroy() {
    this.$bus.$off('quick-function-resize', this.resize)
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapActions('app', ['setCopySelectedNodeId', 'setBeingAddedComponentId']),
    tryToAddComponent() {
      this.setBeingAddedComponentId(this.id)
    },
    vmCreateEmptyItem() {
      vmCreateEmptyItem(this.node)
    },
    animate() {
      if (!this.node) {
        if (process.env.NODE_ENV === 'production') {
          console.warn('component operator has no node')
        }
        return
      }

      const element = document.querySelector(
        `[data-node][id='${this.node.id}']`
      )

      if (!element) {
        return
      }

      const rect = element.getBoundingClientRect()

      let { x: left, y: top, width, height } = rect

      const bounderNode = element.closest('.art-board')

      if (!bounderNode) {
        return
      }

      const { y: top1, height: height1 } = bounderNode.getBoundingClientRect()

      top = top < top1 ? top1 : top
      height =
        rect.top + height >= top1 + height1
          ? top1 + height1 - top
          : rect.top < top1
            ? rect.top + height - top1
            : height

      if (height < 5 || left < 10 || top < 10) {
        return
      }

      Object.assign(this.$data, {
        left,
        top,
        width: width - 2,
        height: height - 2,
        visible: true
      })

      const progress = +new Date() - this.startTime
      if (progress < 250) {
        this.animateId = window.requestAnimationFrame(this.animate)
      }
    },
    resize: debounce(function() {
      if (this.animateId) {
        cancelAnimationFrame(this.animateId)
      }

      this.$nextTick(() => {
        this.visible = false
        this.startTime = +new Date()
        this.animateId = requestAnimationFrame(this.animate)
      })
    }, 80),
    mouseenter() {
      timeId = setTimeout(() => {
        this.hovering = true
      }, 100)
    },
    mouseleave() {
      clearTimeout(timeId)
      this.hovering = false
    }
  }
}
</script>

<style scoped lang="scss">
.quick-functions {
  position: absolute;
  pointer-events: none;
  border: 1px dashed $color-active;
  top: 0;
  left: 0;
}

.wrapper {
  pointer-events: all;
  position: absolute;
}

.top {
  left: 0;
  top: -35px;
}

.bottom {
  left: 0;
  bottom: -35px;
}

.right {
  right: -28px;
  bottom: 0;
}

.component-name {
  background-color: white;
  white-space: pre;
  padding-right: 5px;
  padding-left: 5px;
  border: 1px solid $color-active;
  border-radius: 5px;
  color: $color-active !important;
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  transition: all 0.5s ease;
}

::v-deep > .el-button {
  color: $color-active;
}

.uniq-function {
  position: absolute;
  left: 0;
  bottom: -33px;
  opacity: 0.9;
  pointer-events: all;
  width: 125px;
}
</style>
