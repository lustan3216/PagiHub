<template>
  <el-popover
    :visible-arrow="false"
    placement="top-start"
    effect="light"
    trigger="hover"
    popper-class="hide-popper"
  >
    <div class="component-name flex">
      <i
        v-if="!isSlider && !isBackground"
        :class="
          itemEditing && !hoverIcon
            ? 'el-icon-edit-outline'
            : 'el-icon-copy-document'
        "
        :style="{ cursor: itemEditing && !hoverIcon ? 'default' : 'pointer' }"
        class="move-icon"
        type="text"
        style="padding: 8px 2px 8px 5px;"
        @mouseenter="hoverIcon = true"
        @mouseleave="hoverIcon = false"
        @click="copy"
      />

      <component-names :id="id"/>
    </div>

    <div
      v-if="node"
      slot="reference"
      :style="styles"
      :class="{
      'no-action': static || itemEditing || isBackground || wheeling,
      border
    }"
      class="quick-functions flex-center"
      @dblclick.stop="$emit('dblclick', $event)"
      @contextmenu="$emit('contextmenu', $event)"
      @wheel="onWheel"
    >
      <template v-if="!gridResizing && visible && selected">
        <portal to="CopyDesignButton">
          <el-button
            v-if="!isBackground"
            @click="copy"
          >
            Copy Design
          </el-button>
        </portal>
      </template>
    </div>
  </el-popover>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import ComponentNames from './ComponentNames'
import {
  isBackground,
  isTextEditor,
  isGroup,
  isSlider
} from '@/utils/node'
import { vmGet } from '@/utils/vmMap'
import { arrayLast } from '@/utils/array'
import { cloneJson, getValueByPath, globalDebounce } from '@/utils/tool'
import { CAN_BE_EDITED } from '@/const'
import { Popover } from 'element-ui'

export default {
  name: 'OperatorExample',
  components: {
    ComponentNames,
    ElPopover: Popover
  },
  inject: {
    exampleViewPort: {
      default: {
        scale: 1
      }
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    hovered: {
      type: Boolean,
      default: false
    },
    rect: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      animationId: null,
      canGoBack: null,
      hoverIcon: false,
      wheeling: false,
      windowHeight: 0,
      windowY: 0
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'editingPath',
      'isAdding'
    ]),
    ...mapState('layout', ['gridResizing', 'scrolling']),
    ...mapGetters('app', ['selectedComponentNodes']),
    scale() {
      return this.exampleViewPort.scale
    },
    styles() {
      return {
        transform: `translate(${Math.round(this.rect.x / this.scale)}px, ${Math.round(this.rect.y / this.scale)}px`,
        width: Math.round(this.rect.width / this.scale) + 'px',
        height: Math.round(this.rect.height / this.scale) + 'px',
        zIndex: this.selected ? this.zIndex + 1 : this.zIndex
      }
    },
    zIndex() {
      // w h 越小 zindex越大
      const vm = vmGet(this.id, true)
      const { pxW = 0, pxH = 0 } = vm
      const index = Math.floor((30000 - pxW - pxH) / 100)
      return this.selected ? index * 2 : index
    },
    visible() {
      const windowBottom = this.windowY + this.windowHeight
      return this.rect.y < windowBottom && this.rect.y + this.rect.height > this.windowY
    },
    border() {
      if (!this.gridResizing && !this.scrolling) {
        if (this.isBackground) {
          return this.selected
        }
        else {
          return this.hovered || this.selected
        }
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
    isLastOne() {
      return arrayLast(this.selectedComponentIds) === this.id
    },
    static() {
      return this.isBackground || isSlider(this.node)
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
  mounted() {
    const { height, y } = document.getElementById('example-view-port').getBoundingClientRect()
    this.windowHeight = height
    this.windowY = y
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    onWheel(event) {
      event.preventDefault()
      this.wheeling = true

      globalDebounce(() => {
        this.wheeling = false
      }, 50)
    },
    copy() {
      this.$bus.$emit('node-tree-add', cloneJson(this.node))
      this.$bus.$emit('dialog-component-visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.quick-functions {
  position: absolute;
  touch-action: none;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.border {
  border: 1px solid $color-active;
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

::v-deep.component-name {
  background-color: white;
  white-space: pre;
  padding-right: 5px;
  padding-left: 5px;
  border: 1px solid $color-active;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  height: 28px;
  transition: all 0.3s ease;

  & * {
    color: $color-active !important;
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
    pointer-events: all;
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
