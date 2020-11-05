<template>
  <div
    v-if="node && visible"
    :style="styles"
    :class="{
      'no-action': static || itemEditing || isBackground || scrolling
    }"
    class="quick-functions flex-center"
    @mousedown.stop="$emit('mousedown', $event)"
    @mouseup.stop="$emit('mouseup', $event)"
    @dblclick.stop="$emit('dblclick', $event)"
    @contextmenu="$emit('contextmenu', $event)"
    @wheel="onWheel"
  >
    <portal-target
      v-if="itemEditing"
      :style="textEditorStyle"
      name="QuickFunctionsTextEditor"
      slim
      class="can-action"
    />

    <div class="wrapper flex top">
      <div
        v-if="selected && isLastOne"
        class="component-name flex"
      >
        <i
          v-if="!isSlider && !isBackground"
          :class="
            itemEditing && !hoverIcon ? 'el-icon-edit-outline' : 'el-icon-rank'
          "
          :style="{ cursor: itemEditing && !hoverIcon ? 'default' : 'move' }"
          class="move-icon"
          type="text"
          style="padding: 8px 2px 8px 5px;"
          @mouseenter="hoverIcon = true"
          @mouseleave="hoverIcon = false"
        />

        <div
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
        >
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
              />
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

    <template v-if="selected && !isSlider">
      <template v-if="!shouldAutoHeight">
        <div class="resizable-handle-both" />
        <div class="resizable-handle-bottom" />
      </template>

      <div class="resizable-handle-right" />
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ComponentName from './ComponentName'
import { Popover } from 'element-ui'
import {
  isGrid,
  isBackground,
  traversalAncestorAndSelf,
  isTextEditor,
  isGroup,
  isSlider
} from '@/utils/node'
import { arrayLast } from '@/utils/array'
import { vmCreateEmptyItem } from '@/utils/vmMap'
import { isMac } from '@/utils/device'
import { getValueByPath } from '@/utils/tool'
import { BIconPlusSquareFill } from 'bootstrap-vue'
import OftenUseMenu from './OftenUseMenu'
import { CAN_BE_EDITED } from '@/const'
import interact from 'interactjs'

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
    },
    visible: {
      type: Boolean,
      default: false
    },
    rect: {
      type: DOMRect,
      required: true
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      zIndex: this.isExample ? 2005 : 2000,
      animationId: null,
      canGoBack: null,
      hovering: false,
      hoverIcon: false,
      scrolling: false
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'editingPath',
      'isAdding'
    ]),
    ...mapState('layout', ['gridResizing', 'windowHeight']),
    ...mapGetters('app', ['selectedComponentNodes']),
    styles() {
      return {
        top: this.rect.y + 'px',
        left: this.rect.x + 'px',
        width: this.rect.width + 1 + 'px',
        height: this.rect.height + 'px',
        zIndex: this.selected ? this.zIndex + 1 : this.zIndex
      }
    },
    canBeEdited() {
      return this.node && this.node[CAN_BE_EDITED]
    },
    node() {
      return this.nodesMap[this.id]
    },
    shouldAutoHeight() {
      return isTextEditor(this.node) || isGroup(this.node)
    },
    isBackground() {
      return isBackground(this.node)
    },
    isButton() {
      return this.node.tag === 'flex-button'
    },
    isSlider() {
      return isSlider(this.node)
    },
    selected() {
      return this.selectedComponentIds.includes(this.id)
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
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    static() {
      return this.node.lock || this.isBackground || isSlider(this.node)
    },
    isDraggable() {
      const userCanDrag = getValueByPath(this.node, ['props', 'userCanDrag'])
      return (
        (!this.isAdding && this.isDraftMode) ||
        (this.isProductionMode && userCanDrag)
      )
    },
    isResizable() {
      const userCanResize = getValueByPath(this.node, [
        'props',
        'userCanResize'
      ])
      return this.isDraftMode || userCanResize
    }
  },
  watch: {
    static() {
      this.tryMakeDraggable()
      this.tryMakeResizable()
    },
    isDraggable() {
      this.tryMakeDraggable()
    },
    isResizable() {
      this.tryMakeResizable()
    }
  },
  mounted() {
    this.interactObj = interact(this.$el)
    this.tryMakeDraggable()
    this.tryMakeResizable()
  },
  beforeDestroy() {
    this.interactObj.unset()
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapActions('app', ['setCopySelectedNodeId', 'setBeingAddedComponentId']),
    onWheel() {
      clearTimeout(timeId)
      this.scrolling = true
      timeId = setTimeout(() => {
        this.scrolling = false
        timeId = null
      }, 50)
    },
    tryMakeDraggable: function() {
      if (this.isDraggable && !this.static) {
        const opts = {
          ignoreFrom: '.item-editing',
          allowFrom: 'div, .move-icon'
        }
        this.interactObj.draggable(opts)
        this.interactObj.on('dragstart dragmove dragend', event => {
          this.$bus.$emit(`handle-drag-${this.id}`, event)
        })
      }
      else {
        this.interactObj.draggable({
          enabled: false
        })
      }
    },
    tryMakeResizable: function() {
      if (this.isResizable && !this.static) {
        const opts = {
          preserveAspectRatio: true,
          edges: {
            left: false,
            right: '.resizable-handle-both, .resizable-handle-right',
            bottom: '.resizable-handle-both, .resizable-handle-bottom',
            top: false
          },
          ignoreFrom: '.item-editing'
        }

        this.interactObj.resizable(opts)
        this.interactObj.on('resizestart resizemove resizeend', event => {
          this.$bus.$emit(`handle-resize-${this.id}`, event)
        })
      }
      else {
        this.interactObj.resizable({
          enabled: false
        })
      }
    },
    tryToAddComponent() {
      this.setBeingAddedComponentId(this.id)
    },
    vmCreateEmptyItem() {
      vmCreateEmptyItem(this.node)
    },
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
  touch-action: none;
  border: 1px solid $color-active;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.wrapper {
  pointer-events: all;
  position: absolute;
}

.top {
  left: -1px;
  top: -32px;
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
  border-radius: 3px;
  color: $color-active !important;
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  transition: all 0.3s ease;
  & * {
    transition: all 0.3s ease;
  }
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
.resizable-handle {
  &-both,
  &-right,
  &-bottom {
    position: absolute;
    width: 9px;
    height: 9px;
    border: 1px solid $color-active;
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    z-index: 100;
    display: block;
    background-color: #fff;
  }

  &-both {
    bottom: -4px;
    right: -4px;
  }

  &-right {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &-bottom {
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
  }
}
</style>
