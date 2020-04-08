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
      :default-expanded-keys="selectedComponentIds"
      :indent="12"
      class="tree"
      node-key="id"
      highlight-current
      show-checkbox
      @check="checkedChange"
    >
      <template v-slot="{ data }">
        <node-controller
          :id="data.id"
          :exclude="['copy', 'delete']"
          class="w-100"
        />
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { GRID_ITEM } from '../../const'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { traversal, cloneJson } from '../../utils/tool'
import { shortTagName } from '../../utils/node'
import NodeController from '../Abstract/NodeController'

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
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('draft', ['tree']),
    neatTreeOnlyForDisplay() {
      // 這棵樹是髒的，純粹為了渲染而已，建議不要使用裡面有資料是錯的
      const cloned = cloneJson(this.tree)
      traversal(cloned, node => {
        if (node.tag === GRID_ITEM) {
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
    },
    selectedComponentIds: {
      handler(newValue) {
        this.$nextTick(() => {
          this.$refs.tree.setChecked(1, false, true)
          newValue.forEach(x => this.$refs.tree.setChecked(x, true))
        })
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_ID']),
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    },
    checkedChange({ id }) {
      this.TOGGLE_SELECTED_COMPONENT_ID(id)
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
