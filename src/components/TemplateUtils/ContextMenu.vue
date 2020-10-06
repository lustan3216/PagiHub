<template>
  <div class="el-dropdown-menu">
    <component-move>
      <template
        v-slot="{
          canMoveForward,
          canMoveBackward,
          moveForward,
          moveToFront,
          moveToBackward,
          moveToEnd
        }"
      >
        <div>
          <div
            :class="{ 'is-disabled': !canMoveForward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToFront)"
          >
            <span>Move to the front</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveForward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveForward)"
          >
            <span>Move Forward</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToBackward)"
          >
            <span>Move Backward</span>
          </div>
          <div
            :class="{ 'is-disabled': !canMoveBackward }"
            class="el-dropdown-menu__item"
            type="text"
            @click="close(moveToEnd)"
          >
            <span>Move End</span>
          </div>
        </div>
      </template>
    </component-move>

    <template v-for="option in options">
      <div
        v-if="option.divided"
        :key="`${option.name}-d`"
        class="el-dropdown-menu__item--divided"
      />

      <div
        :key="option.name"
        :divided="option.divided"
        :class="{ 'is-disabled': option.disabled }"
        class="el-dropdown-menu__item"
        type="text"
        @click="handleCommand(option.name)"
      >
        <div class="justify-between">
          <span>{{ option.name }}</span>
          <span
            v-if="option.shortKey"
            class="m-l-15"
            v-html="option.shortKey.join(' + ')"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { isGridItem } from '@/utils/node'
import { isMac } from '@/utils/device'
import {
  vmAddNode,
  vmPasteNodes,
  vmRemoveNode,
  vmBecomeMaster
} from '@/utils/vmMap'
import ComponentMove from './ComponentMove'
import { getValueByPath } from '@/utils/tool'
import { COMPONENT_SET } from '@/const'
import { isInstanceChild } from '@/utils/inheritance'
import ClickOutside from '@/directive/clickOutside'

export default {
  name: 'ContextMenu',
  components: {
    ComponentMove
  },
  directives: {
    ClickOutside
  },

  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds'
    ]),
    ...mapGetters('app', ['selectedComponentNodes', 'theOnlySelectedComponentId']),
    ...mapState('layout', ['gridResizing']),
    metaKey() {
      return isMac() ? '&#8984;' : '&#8963;'
    },
    theOnlyCopyNodeAndNotGridItem() {
      if (this.copyComponentIds.length === 1) {
        const node = this.nodesMap[this.copyComponentIds[0]]
        return node && !isGridItem(node)
      }
    },
    canNotDelete() {
      const { parentNode } = this.node
      if (
        getValueByPath(parentNode, 'parentNode.tag') === COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
      else if (
        getValueByPath(parentNode, 'parentNode.parentNode.tag') ===
          COMPONENT_SET &&
        parentNode.children.length === 1
      ) {
        return true
      }
    },
    options() {
      return [
        {
          name: 'Copy',
          shortKey: [this.metaKey, 'C'],
          divided: true
        },
        {
          name: 'Paste Inside',
          shortKey: [this.metaKey, 'V'],
          disabled: isGridItem(this.node)
        },
        {
          name: 'Replace',
          shortKey: [this.metaKey, 'V'],
          disabled: !isGridItem(this.node)
        },
        {
          name: 'Cut',
          shortKey: [this.metaKey, 'X'],
          disabled: this.selectedComponentIds.length !== 1
        },
        { name: 'Duplicate' },
        {
          name: 'Delete',
          shortKey: ['&#9003;'],
          disabled: isInstanceChild(this.node)
        },
        {
          name: 'Make Master Component',
          divided: true
        }
      ]
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    ...mapMutations('app', { 'APP_SET': 'SET' }),
    ...mapActions('app', ['setCopySelectedNodeId']),
    close(fn) {
      fn()
      this.$emit('close')
    },
    handleCommand(command) {
      switch (command) {
        case 'Copy':
          this.setCopySelectedNodeId(this.selectedComponentIds)
          break
        case 'Cut':
          this.setCopySelectedNodeId(this.selectedComponentIds)
          this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
          break
        default:
          this.selectedComponentNodes.forEach(node => {
            switch (command) {
              case 'Paste Inside':
                vmPasteNodes()
                break
              case 'Replace':
                vmPasteNodes()
                break
              case 'Duplicate':
                this.APP_SET({ copyComponentIds: [node.id] })
                vmAddNode(node)
                break
              case 'Delete':
                vmRemoveNode(node)
                break
              case 'Make Master Component':
                vmBecomeMaster(node)
                break
            }
          })
      }

      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.el-dropdown-menu__item--divided {
  padding: 0 20px;
}
.el-dropdown-menu {
  z-index: 1000;
}
.el-dropdown-menu__item {
  line-height: 27px;
  font-size: 13px;
  white-space: pre;
}
</style>
