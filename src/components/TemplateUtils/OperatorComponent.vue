<template>
  <!--  dragover isAdding is for image dropping-->
  <div
    v-if="node"
    :style="styles"
    :class="{
      'no-action': static || itemEditing || isBackground || wheeling,
      border
    }"
    class="quick-functions"
    @dblclick="dblclick"
    @wheel="onWheel"
    @dragover="APP_SET({ isAdding: true })"
  >
    <template v-if="!isSlider && !isBackground && resizeHandler">
      <template v-if="!shouldAutoHeight">
        <div class="resizable-handle-both" />
        <div class="resizable-handle-bottom" />
      </template>

      <div class="resizable-handle-right" />
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import ComponentNames from './ComponentNames'
import {
  isBackground,
  isTextEditor,
  isGroup,
  isSlider,
  isImage
} from '@/utils/node'
import { arrayLast } from '@/utils/array'
import { getValueByPath, globalDebounce } from '@/utils/tool'
import OftenUseMenu from './OftenUseMenu'
import interact from 'interactjs'
import { vmGet } from '@/utils/vmMap'

export default {
  name: 'OperatorComponent',
  components: {
    ComponentNames,
    OftenUseMenu
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
      hoverIcon: false,
      wheeling: false,
      resizeEventSet: false,
      dragEventSet: false
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'editingPath',
      'isAdding'
    ]),
    ...mapState('layout', ['gridResizing', 'windowHeight', 'windowY', 'scaleRatio', 'scrolling']),
    ...mapGetters('app', ['selectedComponentNodes']),
    styles() {
      return {
        transform: `translate(${Math.round(this.rect.x / this.scaleRatio)}px, ${Math.round(this.rect.y / this.scaleRatio)}px`,
        width: Math.round(this.rect.width / this.scaleRatio) + 'px',
        height: Math.round(this.rect.height / this.scaleRatio) + 'px',
        zIndex: this.selected ? this.zIndex + 1 : this.zIndex
      }
    },
    zIndex() {
      // w h 越小 zindex越大
      const vm = vmGet(this.id)
      const { pxW = 0, pxH = 0 } = vm
      const index = Math.floor((30000 - pxW - pxH) / 100)
      return this.selected ? index * 2 : index
    },
    resizeHandler() {
      return !this.gridResizing && this.selected && this.isResizable
    },
    border() {
      if (!this.gridResizing && this.isResizable && !this.scrolling) {
        if (this.isBackground) {
          return this.selected
        }
        else if (isGroup(this.node)) {
          return this.itemEditing || this.hovered || this.selected
        }
        else {
          return this.hovered || this.selected
        }
      }
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
    isTextEditor() {
      return isTextEditor(this.node)
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
      if (this.isDraftMode) {
        return !this.isAdding
      }
      else {
        return getValueByPath(this.node, ['props', 'userCanDrag'])
      }
    },
    isResizable() {
      return this.isDraftMode || getValueByPath(this.node, ['props', 'userCanResize'])
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
    if (this.interactObj) {
      this.interactObj.unset()
    }
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    ...mapMutations('asset', ['OPEN_ASSET']),
    onWheel(event) {
      event.preventDefault()
      this.wheeling = true

      globalDebounce(() => {
        this.wheeling = false
      }, 50)
    },
    tryMakeDraggable: function() {
      if (this.isDraggable && !this.static) {
        const opts = {
          ignoreFrom: '.menububble, .ProseMirror',
          allowFrom: 'div, .move-icon'
        }
        this.interactObj.draggable(opts)

        if (!this.dragEventSet) {
          this.dragEventSet = true
          this.interactObj.on('dragstart dragmove dragend', event => {
            switch (event.type) {
              case 'dragstart':
                this.$emit('moveStart')
                break
              case 'dragmove':
                this.$emit('move')
                break
              case 'resizeend':
                this.$emit('moved')
                break
            }

            this.$bus.$emit(`handle-drag-${this.id}`, event)
          })
        }
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
          }
        }

        this.interactObj.resizable(opts)
        if (!this.resizeEventSet) {
          this.resizeEventSet = true
          this.interactObj.on('resizestart resizemove resizeend', event => {
            switch (event.type) {
              case 'resizestart':
                this.$emit('resizeStart')
                break
              case 'resizemove':
                this.$emit('resize')
                break
              case 'resizeend':
                this.$emit('resized')
                break
            }

            this.$bus.$emit(`handle-resize-${this.id}`, event)
          })
        }
      }
      else {
        this.interactObj.resizable({
          enabled: false
        })
      }
    },
    dblclick(event) {
      this.$emit('dblclick', event)
      if (isImage(this.node)) {
        this.APP_SET({ beingAddedComponentId: this.id })
        this.OPEN_ASSET()
      }
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
