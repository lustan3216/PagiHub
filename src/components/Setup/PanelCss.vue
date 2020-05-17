<template>
  <div>
    <node-info
      :id="theOnlySelectedComponentId"
      parent
    />
    <node-info
      :id="theOnlySelectedComponentId"
      parent
    />
    <span class="el-tree-node__label"> > </span>
    <node-info
      :id="theOnlySelectedComponentId"
    />
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
            <visibility
              v-if="data.tag !== gridItem"
              :id="data.id"
            />

            <el-button
              type="text"
              icon="el-icon-attract"
            />

            <el-button
              type="text"
              icon="el-icon-copy-document"
              @click.stop="() => copy(data)"
            />

            <el-button
              type="text"
              icon="el-icon-delete"
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
import { mapGetters, mapMutations, mapState } from 'vuex'
import { traversal } from '@/utils/tool'
import { GRID_ITEM } from '@/const'
import Visibility from '../TemplateUtils/Visible'
import NodeInfo from '../TemplateUtils/NodeInfo'

export default {
  name: 'PanelCss',
  components: {
    ElTree: Tree,
    Visibility,
    NodeInfo
  },
  data() {
    return {
      filterText: '',
      selected: null
    }
  },
  computed: {
    ...mapState('component', ['tree']),
    ...mapGetters('app', ['theOnlySelectedComponentId']),
    gridItem() {
      return GRID_ITEM
    },
    neatTree() {
      const cloned = clone(this.tree)
      traversal(cloned, function(node) {
        if (node.tag === GRID_ITEM) {
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
    if (this.theOnlySelectedComponentId) {
      this.$refs.tree.setCurrentKey(this.theOnlySelectedComponentId)
    }
  },
  beforeDestroy() {
    if (this.selected) {
      this.vmMap[this.selected].$el
        .closest('.vue-grid-item')
        .classList.remove('elevate')
    }
  },
  methods: {
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_IN_IDSS']),
    filterTagBySearching(value, data) {
      if (!value) return true
      return data.tag.indexOf(value) !== -1
    },
    copy(data) {
      if (data.tag === GRID_ITEM) {
        this.vmMap[data.parentId].new(data.id)
      } else {
        const parentNode = this.componentsMap[data.parentId]
        this.vmMap[parentNode.parentId].copy(data.parentId)
      }
    },
    remove(data) {
      this.vmMap[data.parentId].remove(data.id)
    },
    nodeClick() {
      const componentId = this.$refs.tree.getCurrentKey()
      this.TOGGLE_SELECTED_COMPONENT_IN_IDS(+componentId)
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
