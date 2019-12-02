<template>
  <flex-sidebar>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
    <el-tree
      ref="tree"
      :filter-node-method="filterNode"
      :data="neatTree"
      :indent="12"
      node-key="id"
      default-expand-all
      @node-click="nodeClick"
    >
      <template v-slot="{ node, data }">
        <span class="justify-between w-100">
          <span class="el-tree-node__label align-center">
            {{ data.type || data.tag }} - {{ data.id }}
          </span>
          <span>
            <visibility v-if="data.tag !== 'grid-item'" :id="data.id" />
            <el-button size="mini" @click.stop="() => copy(data)">
              +
            </el-button>
            <el-button size="mini" @click.stop="() => remove(data)">
              -
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </flex-sidebar>
</template>

<script>
import clone from 'clone'
import { mapState, mapGetters } from 'vuex'
import FlexSidebar from '../Templates/FlexSidebar'
import { traversal } from '../../utils/util'
import { vmMap } from '../../utils/vmMap'
import Visibility from './Visibility'
import globalStatus from '../../observable/globalStatus'

export default {
  name: 'SidebarNodesTree',
  components: {
    FlexSidebar,
    Visibility
  },
  data() {
    return {
      filterText: '',
      selected: null
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    ...mapGetters('nodes', ['tree']),
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
    this.$refs.tree.setCurrentKey(globalStatus.elevateId)
  },
  beforeDestroy() {
    if (this.selected) {
      vmMap[this.selected].$el
        .closest('.vue-grid-item')
        .classList.remove('elevate')
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const key = data.type ? 'type' : 'tag'
      return data[key].indexOf(value) !== -1
    },
    copy(data) {
      if (data.tag === 'grid-item') {
        vmMap[data.parentId].new(data.id)
      } else {
        const parentNode = this.currentNodesMap[data.parentId]
        vmMap[parentNode.parentId].copy(data.parentId)
      }
    },
    remove(data) {
      vmMap[data.parentId].remove(data.id)
    },
    nodeClick() {
      globalStatus.elevateId = this.$refs.tree.getCurrentKey()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep > .el-carousel__container {
  height: auto;
  padding-top: 60%;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}

.sidebar {
  background-color: #fff;
  box-shadow: 2px 0px 5px 0 rgba(32, 48, 60, 0.05);
  width: 350px !important;
}
</style>
