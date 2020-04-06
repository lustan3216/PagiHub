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
      :data="neatTree"
      :indent="12"
      class="tree"
      node-key="id"
      highlight-current
      show-checkbox
      @node-click="nodeClick"
    >
      <template v-slot="{ node, data }">
        <span class="justify-between w-100">
          <span class="el-tree-node__label align-center m-r-10">
            {{ data.tag }} - {{ data.id }}
          </span>

          <span>
            <visibility v-if="data.tag !== 'grid-item'" :id="data.id" />

            <el-button type="text" size="mini" icon="el-icon-attract" />

            <el-button
              type="text"
              size="mini"
              icon="el-icon-copy-document"
              @click.stop="() => copy(data)"
            />

            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click.stop="() => remove(data)"
            />
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import clone from 'clone'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { traversal } from '../../utils/tool'
import { vmMap } from '../../utils/vmMap'
import Visibility from './Controller/Visible'

export default {
  name: 'TreeCss',
  components: {
    ElTree: Tree,
    Visibility
  },
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
    neatTree() {
      const cloned = clone(this.tree)
      traversal(cloned, function(node) {
        if (node.tag === 'grid-item') {
          Object.assign(node, node.children[0])
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
  beforeDestroy() {
    if (this.selected) {
      vmMap[this.selected].$el
        .closest('.vue-grid-item')
        .classList.remove('elevate')
    }
  },
  methods: {
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_IDS']),
    filterTagBySearching(value, data) {
      if (!value) return true
      return data.tag.indexOf(value) !== -1
    },
    copy(data) {
      if (data.tag === 'grid-item') {
        vmMap[data.parentId].new(data.id)
      } else {
        const parentNode = this.nodesMap[data.parentId]
        vmMap[parentNode.parentId].copy(data.parentId)
      }
    },
    remove(data) {
      vmMap[data.parentId].remove(data.id)
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
