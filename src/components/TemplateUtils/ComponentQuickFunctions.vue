<template>
  <div
    v-if="node && visible"
    :id="`quick-fn-${id}`"
    :style="styles"
    class="quick-functions flex-center"
  >
    <portal-target
      :style="textEditorStyle"
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

      <component-quick-add
        v-if="isDraftMode && !isExample && isLastOne"
        :id="id"
        class="flex backface-hidden"
      />
    </div>

    <el-button-group class="uniq-function can-action">
      <el-button
        v-if="isImage"
        class="icon"
        @click="openImageAsset"
      >
        Replace
      </el-button>

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
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ComponentName from './ComponentName'
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
import { vmCreateEmptyItem, vmGet } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import { debounce } from '@/utils/tool'
import { BIconPlusSquareFill } from 'bootstrap-vue'
import ComponentQuickAdd from './ComponentQuickAdd'
import { IMAGE_ASSET } from '@/components/ExampleAddPanel/MenuCategories'

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
  name: 'ComponentQuickFunctions',
  components: {
    ComponentName,
    ElPopover: Popover,
    BIconPlusSquareFill,
    ComponentQuickAdd
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
      zIndex: this.isExample ? 2005 : 2000,
      animationId: null,
      canGoBack: null,
      hovering: false,
      visible: false
    }
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapState('layout', ['gridResizing', 'artBoardHeight']),
    styles() {
      return {
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.width + 'px',
        height: this.height + 'px',
        zIndex: this.zIndex
      }
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
    isImage() {
      return this.node.tag === 'flex-image'
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
      return this.$el
      // return document.getElementById(`quick-fn-${this.id}`)
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
      this.$nextTick(() => {
        this.visible = false
        if (!this.node) {
          return
        }

        const gridItem = getClosetGrimItem(this.node.id)
        const vm = vmGet(
          (gridItem && gridItem.id) || this.node.id,
          this.isExample
        )
        const element = vm && vm.$el

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
          return
        }

        Object.assign(this.$data, {
          left,
          top,
          width: width - 2,
          height: height - 2,
          visible: true
        })
      })
      // 180 不要再動了，因為 griitem 動畫是100 且store/node 裡面也有callback呼叫
    }, 180),
    mouseenter() {
      timeId = setTimeout(() => {
        this.hovering = true
      }, 100)
    },
    mouseleave() {
      clearTimeout(timeId)
      this.hovering = false
    },
    openImageAsset() {
      this.setBeingAddedComponentId(this.id)
      this.$nextTick(() => {
        this.$bus.$emit('dialog-component-tabs-jump', IMAGE_ASSET)
      })
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

::v-deep.uniq-function {
  position: absolute;
  left: 3px;
  top: 3px;
  opacity: 0.9;
  .el-button {
    padding: 4px;
  }
}
</style>
