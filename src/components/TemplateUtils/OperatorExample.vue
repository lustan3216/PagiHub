<template>
  <div
    v-if="node"
    :style="styles"
    :class="{
      'no-action': static || isBackground || scrolling,
      border: !isBackground
    }"
    class="quick-functions flex-center"
    @mousedown.stop="$emit('mousedown', $event)"
    @mouseup.stop="$emit('mouseup', $event)"
    @dblclick.stop="$emit('dblclick', $event)"
    @contextmenu="$emit('contextmenu', $event)"
    @wheel="onWheel"
  >
    <div class="wrapper flex top">
      <div
        v-if="selected && isLastOne"
        class="component-name flex"
      >
        <portal to="CopyDesignButton">
          <el-button
            v-if="!isBackground"
            @click="copy"
          >
            Copy Design
          </el-button>
        </portal>

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
          @copy="copy"
        />

        <component-names :id="id"/>
      </div>
    </div>
  </div>
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
import { arrayLast } from '@/utils/array'
import { cloneJson, getValueByPath } from '@/utils/tool'
import { CAN_BE_EDITED } from '@/const'

let timeId

export default {
  name: 'OperatorExample',
  components: {
    ComponentNames
  },
  props: {
    id: {
      type: String,
      required: true
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
      animationId: null,
      canGoBack: null,
      hoverIcon: false,
      scrolling: false,
      zIndex: 2030,
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
    ...mapState('layout', ['gridResizing']),
    ...mapGetters('app', ['selectedComponentNodes']),
    styles() {
      const windowBottom = this.windowY + (this.windowHeight)
      const height = windowBottom > this.rect.y + this.rect.height
        ? this.windowY > this.rect.y
          ? this.rect.y + this.rect.height - this.windowY
          : this.rect.height
        : windowBottom - this.rect.y

      return {
        top: (this.windowY < this.rect.y ? this.rect.y : this.windowY) + 1 + 'px',
        left: this.rect.x + 1 + 'px',
        width: this.rect.width + 'px',
        height: height + 'px',
        zIndex: this.selected ? 3001 : 3000
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
  mounted() {
    const dialog = document.getElementById('examples-dialog')
    const dialogIndex = dialog.style.zIndex
    this.zIndex = parseInt(dialogIndex) + 1

    const { height, y } = document.getElementById('example-view-port').getBoundingClientRect()
    this.windowHeight = height
    this.windowY = y
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    onWheel(event) {
      event.preventDefault()
      clearTimeout(timeId)
      this.scrolling = true
      this.LAYOUT_SET({ gridResizing: true })
      timeId = setTimeout(() => {
        this.scrolling = false
        this.LAYOUT_SET({ gridResizing: false })
        timeId = null
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
