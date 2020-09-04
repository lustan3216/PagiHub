<template>
  <div class="flex-column wh-100">
    <el-tree
      ref="tree"
      :filter-node-method="filterTagBySearching"
      :data="innerTree"
      :indent="12"
      :allow-drop="allowDrop"
      class="tree"
      node-key="id"
      draggable
      default-expand-all
      @node-drop="layerIndexChange"
    >
      <template v-slot="{ data }">
        <div
          v-if="data && data.id"
          class="relative w-100 over-hidden"
          @mouseenter.stop="hoverNode(data.id)"
          @mouseleave.stop="hoverLeaveNode(data.id)"
        >
          <hidden :id="data.id" />
          <component-name
            :id="data.id"
            :class="{ active: selectedComponentIds.includes(data.id) }"
            class="text-left"
            editable
            @click="nodeClick($event, data.id)"
          />

          <transition name="fade">
            <component-controller
              v-if="data.id === hoverId"
              :id="data.id"
              class="controller hover-color"
            />
          </transition>

          <div
            v-if="data.id !== hoverId"
            class="controller"
          >
            <visible :id="data.id" />
            <touchable :id="data.id" />
          </div>
        </div>
      </template>
    </el-tree>

    <el-input
      v-shortkey.avoid
      v-model="filterText"
      placeholder="Search Node"
      size="small"
      class="m-b-10"
    />
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { SORT_INDEX, SOFT_DELETE, STYLE } from '@/const'
import { mapState, mapMutations, mapActions } from 'vuex'
import { arrayUniq, deleteBy, findIndexBy } from '@/utils/array'
import { cloneJson } from '@/utils/tool'
import ComponentController from '../TemplateUtils/ComponentController'
import ComponentName from '../TemplateUtils/ComponentName'
import Touchable from '../TemplateUtils/Touchable'
import Visible from '../TemplateUtils/Visible'
import Hidden from '../TemplateUtils/Hidden'
import {
  isDesign,
  isGridItem,
  isLayers,
  isPage,
  shortTagName,
  sortByIndex,
  traversalSelfAndChildren
} from '@/utils/node'

require('smoothscroll-polyfill').polyfill()

export default {
  name: 'PanelNodes',
  components: {
    ElTree: Tree,
    ComponentController,
    ComponentName,
    Touchable,
    Visible,
    Hidden
  },
  data() {
    return {
      hoverId: null,
      filterText: ''
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'breakpoint']),
    ...mapState('node', ['editingComponentSetId']),
    componentSetNode() {
      return this.componentsMap[this.editingComponentSetId]
    },
    innerTree() {
      const tree = this.componentSetNode

      if (!tree) {
        return
      }

      const cloneTree = cloneJson(tree)
      traversalSelfAndChildren(cloneTree, (node, parentNode) => {
        node.children = node.children.filter(node => node && !node[SOFT_DELETE])

        if (isLayers(node)) {
          parentNode.children = sortByIndex(node.children, false)
        }

        if (isGridItem(node)) {
          const index = parentNode.children.findIndex(x => x.id === node.id)
          if (index >= 0 && node.children[0]) {
            parentNode.children[index] = node.children[0]
          }
        }

        delete node[STYLE]
      })

      return cloneTree.children
    }
    // editingNode() {
    //   return this.componentsMap[this.editingComponentSetId]
    // },
    // editingNodeName() {
    //   return shortTagName(this.editingNode)
    // },
    // editingPath() {
    //   if (isDesign(this.editingNode)) {
    //     return this.editingNodeName
    //   }
    //   else if (isPage(this.editingNode)) {
    //     const { parentNode } = this.editingNode
    //     return [parentNode.label, this.editingNodeName].join(' > ')
    //   }
    // },
    // pathIcon() {
    //   if (isDesign(this.editingNode)) {
    //     return 'el-icon-news'
    //   }
    //   else if (isPage(this.editingNode)) {
    //     return 'el-icon-files'
    //   }
    // }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    ...mapActions('app', ['resizeNodeQuickFn']),
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('node', ['RECORD']),
    allowDrop(drag, drop, action) {
      const sameLayer = drag.parent === drop.parent
      return sameLayer && ['prev', 'next'].includes(action)
    },
    layerIndexChange(drag, drop) {
      const records = drop.parent.childNodes.map(({ data }, index) => {
        return {
          path: `${data.id}.${SORT_INDEX}`,
          value: index
        }
      })

      this.RECORD(records)
    },
    filterTagBySearching(value, { label, tag }) {
      value = value.toLowerCase().toString()
      return (label || tag).toLowerCase().indexOf(value) !== -1
    },
    nodeClick(event, id) {
      if (event.metaKey || event.ctrlKey) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(id)
      }
      else {
        this.TOGGLE_SELECTED_COMPONENT_ID(id)
      }
      this.resizeNodeQuickFn()
      this.scrollIntoView(id)
    },
    hoverNode(id) {
      this.hoverId = id
      this.$bus.$emit(`hover-${id}`, true)
    },
    hoverLeaveNode(id) {
      this.hoverId = null
      this.$bus.$emit(`hover-${id}`, false)
    },
    scrollIntoView(id) {
      if (this.vmMap[id]) {
        // 可能被device hidden 所以map找不到
        this.vmMap[id].$el.scrollIntoView(false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  overflow: scroll;
  flex: 1;
}
.controller {
  position: absolute;
  z-index: 1;
  right: 0;
  top: -1px;
  text-align: right;
  padding: 0 5px;
}
.hover-color {
  background: #f5f7fa;
}
.active {
  background-color: #f0f7ff;
}

.small-title {
  display: block;
  margin: 5px 10px;
}
</style>
