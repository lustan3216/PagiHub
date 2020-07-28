<template>
  <div class="p-r-10">
    <el-button type="text">{{ componentSetName }}</el-button>
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
      :indent="12"
      :allow-drop="allowDrop"
      :expand-on-click-node="false"
      default-expand-all
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
          @dblclick.native.stop="scrollIntoView(data.id)"
          @mouseenter.native.stop="hoverNode(data.id)"
          @mouseleave.native.stop="hoverLeaveNode(data.id)"
        />
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { SORT_INDEX, LAYERS, SOFT_DELETE, PROPS, STYLE } from '@/const'
import { mapState, mapMutations } from 'vuex'
import { cloneJson, traversal, arraySubtract, deleteBy } from '@/utils/tool'
import { shortTagName } from '@/utils/node'
import { isMac } from '@/utils/device'
import NodeController from '../TemplateUtils/NodeController'
import { on, off } from 'element-ui/src/utils/dom'

require('smoothscroll-polyfill').polyfill()

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
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('component', ['editingComponentSetId']),
    componentSetNode() {
      return this.componentsMap[this.editingComponentSetId]
    },
    componentSetName() {
      return this.componentSetNode && shortTagName(this.componentSetNode)
    },
    innerTree() {
      const tree = this.componentSetNode

      if (!tree) {
        return
      }

      const cloneTree = cloneJson(tree)
      traversal(cloneTree, (node, parentNode) => {
        if (node.tag === LAYERS && node.children) {
          node.children.sort((a, b) => a[SORT_INDEX] - b[SORT_INDEX])
        }

        if (node[SOFT_DELETE]) {
          deleteBy(parentNode.children, 'id', node.id)
        }

        delete node[PROPS]
        delete node[STYLE]
      })

      return cloneTree.children
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
          newValue.forEach(id => tree.setChecked(id, true))
        })
      },
      immediate: true
    }
  },
  mounted() {
    on(window, 'keydown', this.keydwon)
    on(window, 'keyup', this.keyup)
  },
  beforeDestroy() {
    off(window, 'keydown', this.keydwon)
    off(window, 'keyup', this.keyup)
  },
  methods: {
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_ID'
    ]),
    ...mapMutations('component', ['RECORD']),
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
    hoverNode(id) {
      this.$bus.$emit(`hover-${id}`, true)
    },
    hoverLeaveNode(id) {
      this.$bus.$emit(`hover-${id}`, false)
    },
    scrollIntoView(id) {
      this.vmMap[id].$el.scrollIntoView({ behavior: 'smooth' })
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
