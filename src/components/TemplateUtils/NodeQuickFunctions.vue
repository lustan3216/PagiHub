<template>
  <portal
    v-if="element"
    :to="`Interface-${id}`"
  >
    <div
      :style="{
        top: top + 'px',
        width: width - 2 + 'px',
        height: height - 2 + 'px',
        left: left + 'px'
      }"
      class="quick-functions"
    >
      <div
        :class="[top > 100 ? 'top' : 'bottom']"
        class="wrapper"
      >
        <node-name
          :id="id"
          class="title"
        />
      </div>

      <div
        :class="[top > 100 ? 'left' : 'right']"
        class="wrapper"
      >
        <el-tooltip
          :placement="top > 100 ? 'left' : 'right'"
          :content="newItemToolTip"
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

        <portal-target
          v-if="isDraftMode"
          :name="`QuickFunctions${id}`"
          slim
        />
      </div>
    </div>
  </portal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NodeName from './NodeName'
import { Popover, Tooltip } from 'element-ui'
import { debounce } from 'throttle-debounce'
import { isGridItem, traversalAncestorAndSelf } from '@/utils/node'
import { isMac } from '@/utils/device'
import {
  vmPasteNodes,
  vmCreateEmptyItem,
  vmRemoveNode,
  vmPasteNode
} from '@/utils/vmMap'
import { CAN_NEW_ITEM, CAROUSEL, GRID_GENERATOR, LAYERS } from '@/const'

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
    }
  },
  data() {
    return {
      top: null,
      left: null,
      width: null,
      height: null
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode'
    ]),
    newItemToolTip() {
      if (!this.node[CAN_NEW_ITEM]) {
        return 'Copy An Empty Grid Item From It'
      } else {
        switch (this.node.tag) {
          case LAYERS:
            return 'Create An New Layer'
          case GRID_GENERATOR:
            return 'Create An Empty Grid Item'
          case CAROUSEL:
            return 'Create An Empty Slider'
        }
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
          shortKey: [this.metaKey, 'X']
        },
        { name: 'Duplicate' },
        {
          name: 'Delete',
          shortKey: ['&#9003;']
        }
      ]
    }
  },
  created() {
    this.$bus.$on(
      `quick-functions-transforming-${this.id}`,
      debounce(250, () => {
        this.assignRect()
      })
    )
    this.assignRect(this.element)
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    assignRect() {
      if (!this.element) {
        return
      }
      this.$nextTick(() => {
        const { x, y, width, height } = this.element.getBoundingClientRect()
        this.width = width
        this.height = height
        this.top = y
        this.left = x
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
          this.APP_SET({ copyComponentIds: [this.id] })
          break
        case 'Paste Inside':
          vmPasteNodes()
          break
        case 'Replace':
          vmPasteNodes()
          break
        case 'Cut':
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
  position: fixed;
  pointer-events: none;
  border: 1px dashed $activeColor !important;
  transition: width 0.38s, height 0.38s, top 0.38s, left 0.38s;
  z-index: 999;
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
  right: 0;
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
    border-radius: 5px 5px 0 0;
  }

  & > *:last-child {
    border-radius: 0 0 5px 5px;
  }
}
</style>
