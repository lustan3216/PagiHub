<template>
  <el-dropdown
    trigger="click"
    size="small"
    @command="handleCommand"
  >
    <span class="icon">
      <i class="el-icon-more-outline" />
    </span>

    <component-move :id="id">
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
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :disabled="!canMoveForward"
            @click.native="moveToFront"
          >Move to the front</el-dropdown-item>
          <el-dropdown-item
            :disabled="!canMoveForward"
            @click.native="moveForward"
          >Move Forward</el-dropdown-item>
          <el-dropdown-item
            :disabled="!canMoveBackward"
            @click.native="moveToBackward"
          >Move Backward</el-dropdown-item>
          <el-dropdown-item
            :disabled="!canMoveBackward"
            @click.native="moveToEnd"
          >Move End</el-dropdown-item>

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
      </template>
    </component-move>
  </el-dropdown>
</template>

<script>
import { isGridItem } from '@/utils/node'
import { isMac } from '@/utils/device'
import { vmPasteNode, vmPasteNodes, vmRemoveNode } from '@/utils/vmMap'
import ComponentMove from './ComponentMove'
import { mapState } from 'vuex'
import { getValueByPath } from '@/utils/tool'
import { COMPONENT_SET } from '@/const'

export default {
  name: 'ContextMenu',
  components: {
    ComponentMove
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState('app', [
      'copyComponentIds',
      'selectedComponentIds',
      'selectedComponentNode',
      'gridResizing'
    ]),
    node() {
      return this.componentsMap[this.id]
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
        },
        {
          name: 'Make Master Component',
          divided: true
        }
      ]
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
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
        case 'Make Master Component':
          this.RECORD({
            path: `${this.id}.isMasterComponent`,
            value: true
          })
          break
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
