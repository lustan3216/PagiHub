<template>
  <portal
    v-if="element"
    :to="`Interface-${id}`"
  >
    <div
      :id="`quick-fn-${id}`"
      class="quick-functions"
    >
      <div
        :class="[top > 100 ? 'top' : 'bottom' ]"
        class="wrapper flex"
      >
        <node-name
          :id="id"
          class="title"
        >
          <i :class="[itemEditing ? 'el-icon-edit-outline' : 'el-icon-rank']" />
        </node-name>

        <portal-target
          v-if="isDraftMode"
          :name="`QuickFunctions${id}`"
          class="button-group"
        />
      </div>

      <div class="left wrapper">
        <el-tooltip
          :content="newItemToolTip"
          effect="light"
          placement="left"
        >
          <el-button
            icon="el-icon-plus"
            class="icon"
            @click="handleCommand('New Item')"
          />
        </el-tooltip>

        <el-dropdown
          trigger="click"
          size="small"
          @command="handleCommand"
        >
          <span class="icon">
            <i class="el-icon-more-outline" />
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="option in options"
              :key="option.name"
              :command="option.name"
              :divided="option.divided"
              :disabled="option.disabled"
            >
              <div class="justify-between">
                <span>{{ option.name }}</span>
                <span
                  v-if="option.shortKey"
                  class="m-l-15"
                  v-html="option.shortKey.join(' + ')"
                />
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </div>
  </portal>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import NodeName from './NodeName'
import { Popover, Tooltip } from 'element-ui'
import { isGridItem, traversalAncestorAndSelf } from '@/utils/node'
import { isMac } from '@/utils/device'
import { lerp } from '@/utils/animation'
import {
  vmPasteNodes,
  vmCreateEmptyItem,
  vmRemoveNode,
  vmPasteNode
} from '@/utils/vmMap'
import { CAN_NEW_ITEM, CAROUSEL, GRID, LAYERS } from '@/const'

let topShared = window.innerHeight / 2
let leftShared = window.innerWidth / 2
let widthShared = 0
let heightShared = 0

export const quickFnMap = {}

export default {
  name: 'NodeQuickFunctions',
  components: {
    NodeName,
    ElPopover: Popover,
    ElTooltip: Tooltip
  },
  props: {
    id: {
      type: String,
      required: true
    },
    itemEditing: {
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
      animationId: null
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode',
      'windowResizing'
    ]),
    newItemToolTip() {
      if (this.node[CAN_NEW_ITEM]) {
        switch (this.node.tag) {
          case LAYERS:
            return 'Create An New Layer'
          case GRID:
            return 'Create An Empty Grid Item'
          case CAROUSEL:
            return 'Create An Empty Slider'
        }
      } else {
        return 'Copy An Empty Grid Item From It'
      }
    },
    node() {
      return this.componentsMap[this.id]
    },
    vm() {
      return this.node && this.node.$vm
    },
    element() {
      return this.vm && this.vm.$el
    },
    isGridItem() {
      return isGridItem(this.node)
    },
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    theOnlyCopyNodeAndNotGridItem() {
      if (this.copyComponentIds.length === 1) {
        const node = this.componentsMap[this.copyComponentIds[0]]
        return node && !isGridItem(node)
      }
    },
    options() {
      return [
        { name: 'Forward' },
        { name: 'Backward' },
        {
          name: 'Copy',
          shortKey: [this.metaKey, 'C'],
          divided: true
        },
        {
          name: 'Paste Inside',
          shortKey: [this.metaKey, 'V'],
          disabled:
            !this.theOnlyCopyNodeAndNotGridItem || !isGridItem(this.node)
        },
        {
          name: 'Replace',
          shortKey: [this.metaKey, 'V'],
          disabled: !this.theOnlyCopyNodeAndNotGridItem || isGridItem(this.node)
        },
        {
          name: 'Cut',
          shortKey: [this.metaKey, 'X'],
          disabled: this.selectedComponentIds.length !== 1
        },
        { name: 'Duplicate' },
        {
          name: 'Delete',
          shortKey: ['&#9003;']
        }
      ]
    },
    framer() {
      // 如果有refs=framer, 在拉動window時不知為什麼會找不到element
      return document.getElementById(`quick-fn-${this.id}`)
    }
  },
  watch: {
    windowResizing(value) {
      if (value) {
        this.framer.style.opacity = 0
      }
    }
  },
  created() {
    this.resize()
    quickFnMap[this.id] = this
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapActions('app', ['setCopySelectedNodeId']),
    resize() {
      this.$nextTick(() => {
        const { x: left, y: top, width, height } = this.element.getBoundingClientRect()

        const alpha = 0.15
        let opacity = 0
        this.animationId && cancelAnimationFrame(this.animationId)

        const animate = () => {
          this.top = topShared = lerp(this.top, top, alpha)
          this.left = leftShared = lerp(this.left, left, alpha)
          this.width = widthShared = lerp(this.width, width, alpha)
          this.height = heightShared = lerp(this.height, height, alpha)
          opacity = lerp(opacity, 1, alpha / 2)

          Object.assign(this.framer.style, {
            width: this.width - 2 + 'px',
            height: this.height - 2 + 'px',
            top: this.top + 'px',
            left: this.left + 'px',
            opacity
          })

          if (
            Math.abs(top - this.top) > 1 ||
            Math.abs(left - this.left) > 1 ||
            Math.abs(width - this.width) > 1 ||
            Math.abs(height - this.height) > 1
          ) {
            this.animationId = requestAnimationFrame(animate)
          } else {
            cancelAnimationFrame(this.animationId)
            Object.assign(this.framer.style, {
              width: width - 2 + 'px',
              height: height - 2 + 'px',
              top: top + 'px',
              left: left + 'px',
              opacity: '1'
            })
          }
        }

        this.animationId = requestAnimationFrame(animate)
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'Forward':
          break
        case 'Backward':
          break
        case 'New Item':
          if (this.node[CAN_NEW_ITEM]) {
            vmCreateEmptyItem(this.node)
          } else {
            traversalAncestorAndSelf(this.node, node => {
              if (isGridItem(node)) {
                this.APP_SET({ copyComponentIds: [node.id] })
                const { children, ...emptyGridItem } = node
                node.parentNode.$vm._addNodesToParentAndRecord(emptyGridItem)
                return 'stop'
              }
            })
          }
          break
        case 'Copy':
          this.setCopySelectedNodeId(this.id)
          break
        case 'Paste Inside':
          vmPasteNodes()
          break
        case 'Replace':
          vmPasteNodes()
          break
        case 'Cut':
          this.setCopySelectedNodeId(this.id)
          vmRemoveNode(this.node)
          break
        case 'Duplicate':
          this.APP_SET({ copyComponentIds: [this.id] })
          vmPasteNode(this.node)
          break
        case 'Delete':
          vmRemoveNode(this.node)
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
$activeColor: rgba(81, 117, 199, 0.68);
.quick-functions {
  position: absolute;
  pointer-events: none;
  border: 1px dashed $activeColor;
  will-change: opacity, height, width, top, left ;
  z-index: 800;
}

.wrapper {
  pointer-events: all;
  position: absolute;
}

.top {
  left: 0;
  top: -30px;
}

.left {
  left: -28px;
  top: 5px;
}

.bottom {
  left: 0;
  bottom: -30px;
}

.right {
  right: -28px;
  bottom: 0;
}

.el-icon-more-outline {
  transform: rotate(90deg);
}
.title {
  background-color: white;
  padding: 5px;
  border: 1px solid $activeColor;
  border-radius: 5px;
  color: $activeColor !important;
}
.left.wrapper,
.right.wrapper {
  display: flex;
  flex-direction: column;
  & > * {
    cursor: pointer;
    background-color: white;
    padding: 3px;
    border: 1px solid $activeColor;
    margin-top: -1px;
  }

  i {
    color: $activeColor !important;
  }

  & > *:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  & > *:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

::v-deep.button-group {
  margin-left: 5px;
  display: flex;
  & > * {
    cursor: pointer;
    background-color: white;
    border: 1px solid $activeColor;
    margin-left: -1px;
  }

  button {
    padding: 5px;
  }

  i {
    color: $activeColor !important;
  }

  & > *:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  & > *:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}
</style>
