<template>
  <div
    v-if="node && visible"
    :id="`quick-fn-${id}`"
    :style="{
      zIndex: isExample ? 2005 : 800
    }"
    :class="{ instance: isInstance }"
    class="quick-functions flex-center"
  >
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
        <inheritance-jumper
          :id="id"
          :inherit-parent-id="inheritParentId"
          :master-component-set-id="masterComponentSetId"
        />

        <portal-target
          v-if="isDraftMode"
          :name="`QuickFunctions${id}`"
          slim
        />

        <stack
          v-if="!isInstance"
          :id="id"
        />

        <lock
          :id="id"
          visible
          allow-multi
        />

        <!--        <el-button-->
        <!--          v-popover:popover-->
        <!--          icon="el-icon-more"-->
        <!--          class="icon"-->
        <!--        />-->

        <el-tooltip
          v-if="!isInstance"
          effect="light"
          placement="top"
        >
          <div slot="content">
            {{ newItemToolTip }} <span
              class="m-l-10"
              v-html="metaKey"
            /> + B
          </div>

          <el-button
            class="icon"
            @click="vmCreateEmptyItem"
          >
            {{ newItemToolTip }}
          </el-button>
        </el-tooltip>

        <el-button
          v-if="isCarousel && !isInstance"
          class="icon"
          @click="deleteSlider"
        >
          Delete Slider
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ComponentName from './ComponentName'
import ZIndex from '@/components/Setup/EditorStyle/ZIndex'
import Stack from '@/components/Setup/EditorStyle/Stack'
import InheritanceJumper from './InheritanceJumper'
import Lock from './Lock'
import { Popover } from 'element-ui'
import {
  isGridItem,
  getNode,
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
import { isInstance } from '@/utils/inheritance'
import gsap from 'gsap'
import { debounce } from '@/utils/tool'

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
    InheritanceJumper,
    ComponentName,
    ZIndex,
    Lock,
    Stack,
    ElPopover: Popover
  },
  props: {
    id: {
      type: String,
      required: true
    },
    inheritParentId: {
      type: String,
      default: ''
    },
    masterComponentSetId: {
      type: String,
      default: ''
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
    newItemToolTip() {
      if (this.node[CAN_NEW_ITEM]) {
        switch (this.node.tag) {
          case GRID_GENERATOR:
            return 'Add Container'
          case CAROUSEL:
            return 'Add Slider'
        }
      }
      else {
        return 'Append Container'
      }
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    node() {
      return getNode(this.id)
    },
    isCarousel() {
      return isCarousel(this.node)
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    isInstance() {
      return isInstance(this.node)
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
      vmCreateEmptyItem(this.node)
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

        if (height < 5) {
          this.visible = false
          return
        }

        const styles = {
          x: Math.round(left),
          y: Math.round(top),
          width: Math.round(width - 2),
          height: Math.round(height - 2)
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
    }, 100),
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
::v-deep.instance,
::v-deep .el-button {
  &.quick-functions,
  .wrapper > *,
  .button-group > * {
    border-color: $color-inherit !important;
    color: $color-inherit !important;
  }

  .button-group i {
    color: $color-inherit;
  }
  .can-action {
    color: $color-inherit;
  }
}

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

.el-icon-more-outline {
  transform: rotate(90deg);
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
  color: $color-active !important;
}

::v-deep .el-button-group {
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
