<template>
  <div class="p-r-10">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      size="small"
      class="m-b-10 transparent"
    />
    <el-tree
      ref="tree"
      :filter-node-method="filterTagBySearching"
      :data="innerTree"
      :default-expanded-keys="selectedComponentIds"
      :indent="12"
      :allow-drop="allowDrop"
      class="tree"
      node-key="id"
      highlight-current
      show-checkbox
      draggable
      check-strictly
      @node-drop="layerIndexChange"
      @check="checkedChange"
    >
      <template v-slot="{ data }">
        <node-controller
          v-if="data && data.id"
          :id="data.id"
          :exclude="['copy', 'portal']"
          class="w-100"
        />
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { SORT_INDEX, LAYERS } from '@/const'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { shortTagName } from '@/utils/node'
import { cloneJson, traversal, arraySubtract } from '@/utils/tool'
import NodeController from '../TemplateUtils/NodeController'

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
    innerTree() {
      const cloneTree = cloneJson(this.tree)
      traversal(cloneTree, node => {
        if (node.tag === LAYERS && node.children) {
          node.children.sort((a, b) => a[SORT_INDEX] - b[SORT_INDEX])
        }
      })

      return cloneTree
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    selectedComponentIds: {
      handler(newValue) {
        this.$nextTick(() => {
          const { tree } = this.$refs
          const checked = tree.getCheckedKeys()
          arraySubtract(checked, newValue).forEach(key =>
            tree.setChecked(key, false)
          )
          newValue.forEach(x => tree.setChecked(x, true))
        })
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('app', ['TOGGLE_SELECTED_COMPONENT_IDS']),
    ...mapMutations('draft', ['RECORD']),
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
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    },
    checkedChange({ id }) {
      this.TOGGLE_SELECTED_COMPONENT_IDS(id)
    }
  }
}
</script>

<style scoped lang="scss">
.tree {
  background: transparent;
  overflow: scroll;
}
</style>
