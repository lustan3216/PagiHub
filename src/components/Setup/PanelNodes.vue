<template>
  <el-tree
    ref="tree"
    :filter-node-method="filterTagBySearching"
    :data="innerTree"
    :indent="12"
    :allow-drop="allowDrop"
    :expand-on-click-node="false"
    default-expand-all
    class="tree"
    node-key="id"
    draggable
    @node-drop="layerIndexChange"
  >
    <template v-slot="{ data }">
      <div
        v-if="data && data.id"
        class="relative w-100 over-hidden"
        @mouseenter.stop="hoverNode(data.id)"
        @mouseleave.stop="hoverLeaveNode(data.id)"
      >
        <hidden
          v-if="checkHidden(data)"
          :id="data.parentId"
        />
        <node-name
          :id="data.id"
          :class="{ active: selectedComponentIds.includes(data.id) }"
          class="text-left"
          editable
          @click="nodeClick($event, data.id)"
        />

        <transition name="fade">
          <node-controller
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
</template>

<script>
import { Tree } from 'element-ui'
import { SORT_INDEX, LAYERS, SOFT_DELETE, STYLE } from '@/const'
import { mapState, mapMutations, mapActions } from 'vuex'
import { cloneJson, traversal, deleteBy } from '@/utils/tool'
import NodeController from '../TemplateUtils/NodeController'
import NodeName from '../TemplateUtils/NodeName'
import Touchable from '../TemplateUtils/Touchable'
import Visible from '../TemplateUtils/Visible'
import Hidden from '../TemplateUtils/Hidden'
import { isGridItem } from '@/utils/node'

require('smoothscroll-polyfill').polyfill()

export default {
  name: 'PanelNodes',
  components: {
    ElTree: Tree,
    NodeController,
    NodeName,
    Touchable,
    Visible,
    Hidden
  },
  props: {
    filterText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds', 'breakpoint']),
    ...mapState('component', ['editingComponentSetId']),
    componentSetNode() {
      return this.componentsMap[this.editingComponentSetId]
    },
    innerTree() {
      const tree = this.componentSetNode

      if (!tree) {
        return
      }

      const cloneTree = cloneJson(tree)
      traversal(cloneTree, (node, parentNode) => {
        if (node.tag === LAYERS && node.children) {
          node.children.sort((a, b) => b[SORT_INDEX] - a[SORT_INDEX])
        }

        if (node[SOFT_DELETE]) {
          deleteBy(parentNode.children, 'id', node.id)
        }

        delete node[STYLE]
      })

      return cloneTree.children
    }
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
    ...mapMutations('component', ['RECORD']),
    checkHidden(node) {
      const parentNode = this.componentsMap[node.parentId]
      if (isGridItem(parentNode)) {
        const { props } = parentNode
        return props && props[this.breakpoint] && props[this.breakpoint].hidden
      }
    },
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
      } else {
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
        this.vmMap[id].$el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  background: transparent;
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
</style>
