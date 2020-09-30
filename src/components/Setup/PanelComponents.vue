<template>
  <div class="flex-column wh-100">
    <el-tree
      ref="tree"
      :filter-node-method="filterTagBySearching"
      :data="tree"
      :indent="20"
      :allow-drop="allowDrop"
      class="tree"
      node-key="id"
      draggable
    >
      <template v-slot="{ data }">
        <div
          v-if="data && data.id"
          :id="`tree-node-${data.id}`"
          class="relative w-100 over-hidden"
          style="margin-left: -6px;"
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

          <div
            class="controller"
            style="width: 48px;"
          >
            <visible
              :id="data.id"
              :visible="data.id === hoverId"
              class="absolute"
              style="left: 15px;"
            />
            <touchable
              :id="data.id"
              :visible="data.id === hoverId"
            />
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
import Tree from '@/vendor/element-ui/tree'
import { SOFT_DELETE } from '@/const'
import { mapState, mapMutations, mapActions } from 'vuex'
import { cloneJson } from '@/utils/tool'
import ComponentController from '../TemplateUtils/ComponentController'
import ComponentName from '../TemplateUtils/ComponentName'
import Touchable from '../TemplateUtils/Lock'
import Visible from '../TemplateUtils/Visible'
import Hidden from '../TemplateUtils/Hidden'
import { traversalSelfAndChildren } from '@/utils/node'

require('smoothscroll-polyfill').polyfill()

export default {
  name: 'PanelComponents',
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
      filterText: '',
      tree: []
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('layout', ['breakpoint']),
    ...mapState('node', ['editingComponentSetId']),
    componentSetNode() {
      return this.nodesMap[this.editingComponentSetId]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selectedComponentIds(ids) {
      ids.forEach(id => {
        const treeNode = this.$refs.tree.getNode(id)
        if (treeNode) {
          treeNode.expand(() => {}, true)
        }
      })
    }
  },
  created() {
    this.renderTree()
    this.$bus.$on('component-add-new', this.renderTree)
    this.$bus.$on('component-delete', this.renderTree)
  },
  beforeDestroy() {
    this.$bus.$off('component-add-new', this.renderTree)
    this.$bus.$off('component-delete', this.renderTree)
  },
  methods: {
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('node', ['RECORD']),
    renderTree() {
      const tree = this.componentSetNode

      if (!tree) {
        return
      }

      const cloneTree = cloneJson(tree)
      traversalSelfAndChildren(cloneTree, (node, parentNode) => {
        node.children = node.children.filter(node => node && !node[SOFT_DELETE])

        // if (isGridItem(node)) {
        //   const index = findIndexBy(parentNode.children, 'id', node.id)
        //   if (Number.isInteger(index) && node.children[0]) {
        //     parentNode.children[index] = node.children[0]
        //   }
        // }
      })

      this.tree = cloneTree.children
    },
    allowDrop(drag, drop, action) {
      const sameLayer = drag.parent === drop.parent
      return sameLayer && ['prev', 'next'].includes(action)
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
  background: #f0f7ff;
}

.small-title {
  display: block;
  margin: 5px 10px;
}
::v-deep {
  .el-tree-node__content {
    height: 30px;
  }
  /*.el-tree-node__expand-icon {*/
  /*  padding-right: 0;*/
  /*}*/
}
</style>