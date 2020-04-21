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
          @mouseover.native.stop="hoverNode"
          @mouseleave="hoverLeaveNode"
        />
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { SORT_INDEX, LAYERS } from '@/const'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { cloneJson, traversal, arraySubtract } from '@/utils/tool'
import { isMac } from '@/utils/device'
import NodeController from '../TemplateUtils/NodeController'
import { vm } from '@/utils/vmMap'

export default {
  name: 'PanelNodes',
  components: {
    ElTree: Tree,
    NodeController
  },
  data() {
    return {
      filterText: '',
      selected: null,
      pressCtrl: false
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
          arraySubtract(checked, newValue).forEach(id =>
            tree.setChecked(id, false)
          )
          newValue.forEach(x => tree.setChecked(x, true))
        })
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('keydown', this.keydwon)
    window.addEventListener('keyup', this.keyup)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydwon)
    window.removeEventListener('keyup', this.keyup)
  },
  methods: {
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('draft', ['RECORD']),
    keydwon(e) {
      if (isMac()) {
        if (e.metaKey) {
          this.pressCtrl = true
        }
      } else {
        if (e.ctrlKey) {
          this.pressCtrl = true
        }
      }
    },
    keyup(e) {
      if (isMac()) {
        if (e.metaKey) {
          this.pressCtrl = false
        }
      } else {
        if (e.ctrlKey) {
          this.pressCtrl = false
        }
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
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    },
    checkedChange({ id }) {
      if (this.pressCtrl) {
        this.TOGGLE_SELECTED_COMPONENT_IN_IDS(id)
      } else {
        this.selectedComponentIds.forEach(id => {
          this.$refs.tree.setChecked(id, false)
        })
        this.TOGGLE_SELECTED_COMPONENT_ID(id)
      }
    },
    hoverNode(id) {},
    hoverLeaveNode(id) {}
  }
}
</script>

<style scoped lang="scss">
.tree {
  background: transparent;
  overflow: scroll;
}
</style>
