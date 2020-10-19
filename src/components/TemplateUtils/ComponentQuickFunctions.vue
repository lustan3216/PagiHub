<template>
  <div
    v-if="node && visible"
    :id="`quick-fn-${id}`"
    :style="{
      zIndex: isExample ? 2005 : 2000
    }"
    class="quick-functions flex-center"
  >
    <portal-target
      :style="{ left: width + 10 + 'px' }"
      name="QuickFunctionsTextEditor"
      slim
      class="can-action"
    />

    <el-button
      v-if="canAddComponent"
      icon="el-icon-circle-plus"
      style="font-size: 18px;"
      class="can-action"
      type="text"
      size="mini"
      data-cy="add-panel-button"
      @click="tryToAddComponent"
    />

    <el-tooltip
      effect="light"
      content="Append an empty container"
      placement="bottom"
    >
      <el-button
        class="append-container"
        type="text"
        size="mini"
        icon="el-icon-plus"
        @click="vmCreateEmptyItem"
      />
    </el-tooltip>

    <div
      :class="[
        top > 100 || top + height >= artBoardHeight - 100 ? 'top' : 'bottom'
      ]"
      :style="{
        top:
          top + height >= artBoardHeight - 100 && artBoardHeight - height < 100
            ? '5px'
            : ''
      }"
      class="wrapper flex"
    >
      <div
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

      <el-button-group
        v-if="isDraftMode && !isExample && isLastOne"
        class="flex backface-hidden"
      >
        <portal-target
          v-if="isDraftMode"
          :name="`QuickFunctions${id}`"
          slim
        />

        <lock
          :id="id"
          visible
          allow-multi
        />

        <stack
          v-if="!isComponentSet"
          :id="id"
        />

        <template v-if="isCarousel">
          <el-button
            class="icon"
            @click="vmCreateEmptyItem"
          >
            <i class="el-icon-plus" />
            Slider
          </el-button>

          <el-button
            class="icon"
            @click="deleteSlider"
          >
            <i class="el-icon-delete" />
            Slider
          </el-button>
        </template>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import { mapState, mapActions, mapMutations } from 'vuex'
import ComponentName from './ComponentName'
import ZIndex from '@/components/Setup/EditorStyle/ZIndex'
import Stack from '@/components/Setup/EditorStyle/Stack'
import Lock from '../Setup/EditorStyle/Lock'
import { Popover } from 'element-ui'
import {
  isGridItem,
  getClosetGrimItem,
  isComponentSet,
  traversalAncestorAndSelf,
  isCarousel,
  isGrid
} from '@/utils/node'
import { arrayLast } from '@/utils/array'
import { CAN_NEW_ITEM, CAROUSEL, GRID_GENERATOR } from '@/const'
import { vmCreateEmptyItem, vmGet } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import { debounce } from '@/utils/tool'
import { BIconPlusSquareFill } from 'bootstrap-vue'
import BasicComponentAdd from './BasicComponentAdd'

let topShared = window.innerHeight / 2
let leftShared = window.innerWidth / 2
let widthShared = 0
let heightShared = 0

export const quickFnMap = {}

if (process.env.NODE_ENV !== 'production') {
  window.quickFnMap = quickFnMap
}

let timeId

export default {
  name: 'ComponentQuickFunctions',
  components: {
    ComponentName,
    ZIndex,
    Lock,
    Stack,
    ElPopover: Popover,
    BIconPlusSquareFill,
    BasicComponentAdd
  },
  props: {
    id: {
      type: String,
      required: true
    },
    itemEditing: {
      type: Boolean,
      default: false
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
      animationId: null,
      canGoBack: null,
      hovering: false,
      visible: true
    }
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapState('layout', ['gridResizing', 'artBoardHeight']),
    nodesPath() {
      const nodes = []
      traversalAncestorAndSelf(this.node, node => {
        if (!isGrid(node)) {
          nodes.push(node)
        }

        return !isComponentSet(node)
      })
      return nodes.slice(0, 4)
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    node() {
      return this.nodesMap[this.id]
    },
    isCarousel() {
      return isCarousel(this.node)
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    isComponentSet() {
      return isComponentSet(this.node)
    },
    isButton() {
      return this.node.tag === 'flex-button'
    },
    canAddComponent() {
      if (
        (!this.isExample &&
          (this.isGridItem || this.isButton) &&
          this.isLastOne) ||
        this.isComponentSet
      ) {
        const { children = [] } = this.node
        return !children.length
      }
    },
    framer() {
      // 如果有refs=framer, 在拉動window時不知為什麼會找不到element
      return document.getElementById(`quick-fn-${this.id}`)
    }
  },
  created() {
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
      if (this.isComponentSet) {
        vmCreateEmptyItem(this.node.children[0])
      }
      else {
        vmCreateEmptyItem(this.node)
      }
    },
    deleteSlider() {
      vmGet(this.node.id, this.isExample).removeCurrentSlider()
    },
    resize: debounce(function() {
      const self = this
      this.$nextTick(() => {
        if (!this.node) {
          this.visible = false
          return
        }

        const gridItem = getClosetGrimItem(this.node.id)
        const vm = vmGet(
          (gridItem && gridItem.id) || this.node.id,
          this.isExample
        )
        const element = vm && vm.$el

        if (!element) {
          this.visible = false
          return
        }

        const rect = element.getBoundingClientRect()

        let { x: left, y: top, width, height } = rect

        const bounderNode = element.closest('.art-board')

        if (!bounderNode) {
          this.visible = false
          return
        }

        const { y: top1, height: height1 } = bounderNode.getBoundingClientRect()

        // this.visible = top < top1 + height1
        // if (!this.visible) {
        //   return
        // }

        top = top < top1 ? top1 : top
        height =
          rect.top + height >= top1 + height1
            ? top1 + height1 - top
            : rect.top < top1
              ? rect.top + height - top1
              : height

        if (height < 5 || left < 10 || top < 10) {
          this.visible = false
          return
        }

        const styles = {
          x: left,
          y: top,
          width: width - 2,
          height: height - 2
        }

        Object.assign(this.$data, styles)

        if (!this.framer) {
          this.visible = false
          return
        }

        gsap.to(this.framer, {
          ...styles,
          ease: 'ease',
          duration: 0,
          onUpdate() {
            const { width, height, x, y } = this.vars
            leftShared = x
            topShared = y
            widthShared = width
            heightShared = height
            self.top = y
            self.left = x
          }
        })

        this.visible = true
      })
    }, 180),
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
  left: 5px;
  top: -40px;
}

.bottom {
  left: -1px;
  bottom: -40px;
}

.right {
  right: -28px;
  bottom: 0;
}

.basic-component-add {
  background-color: transparent;
  width: 100%;
}

.append-container {
  position: absolute;
  bottom: -10px;
  padding: 0;
  pointer-events: all;
  font-size: 12px;
  height: 18px;
  width: 18px;
  background: #409eff !important;
  color: white !important;
  transform: translateX(-100%);
  left: 50%;
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

::v-deep.wrapper .el-button-group {
  border-radius: 5px;
  background-color: white;
  margin-left: 10px;

  button {
    padding: 5px 8px;
    border: 1px solid $color-active;
  }

  i {
    color: $color-active;
  }
}
</style>
