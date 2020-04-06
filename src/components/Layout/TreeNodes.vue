<template>
  <div>
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      size="small"
      class="m-b-10 transparent"
    />
    <el-tree
      ref="tree"
      :filter-node-method="filterTagBySearching"
      :data="neatTreeOnlyForDisplay"
      :indent="12"
      class="tree"
      node-key="id"
      highlight-current
      show-checkbox
      @node-click="nodeClick"
    >
      <template v-slot="{ data }">
        <span class="justify-between w-100">
          <span class="el-tree-node__label align-center m-r-10">
            {{ data.tag | shortTagName }} - {{ data.id }}
          </span>

          <node-controller :id="data.id" :exclude="['copy', 'delete']" />
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import clone from 'clone'
import { Tree } from 'element-ui'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { traversal } from '../../utils/tool'
import { shortTagName } from '../../utils/node'
import NodeController from './Controller/NodeController'

export default {
  name: 'TreeNodes',
  components: {
    ElTree: Tree,
    NodeController
  },
  filters: { shortTagName },
  data() {
    return {
      filterText: '',
      selected: null
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap']),
    ...mapGetters('draft', ['tree']),
    ...mapGetters('app', ['selectedComponentId']),
    neatTreeOnlyForDisplay() {
      // 這棵樹是髒的，純粹為了渲染而已，建議不要使用裡面有資料是錯的
      const cloned = clone(this.tree)
      traversal(cloned, node => {
        if (node.tag === 'grid-item') {
          Object.assign(node, node.children[0])
          delete node.i
        }

        if (['card', 'drawer', 'form-generator'].includes(node.tag)) {
          Object.assign(node.children, node.children[0].children)
        }
      })
      return cloned
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    if (this.selectedComponentId) {
      this.$refs.tree.setCurrentKey(this.selectedComponentId)
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_IDS']),
    filterTagBySearching(value, data) {
      if (!value) return true
      return data.tag.indexOf(value) !== -1
    },
    nodeClick() {
      const componentId = this.$refs.tree.getCurrentKey()
      this.SET_SELECTED_COMPONENT_IDS(+componentId)
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  background: transparent;
  height: calc(100% - 70px);
  overflow: scroll;
}
</style>
