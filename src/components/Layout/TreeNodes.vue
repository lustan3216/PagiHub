<template>
  <div class="p-5">
    <div class="text-center">
      <span class="el-dropdown m-b-5 bold">NODES</span>
    </div>
    
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
      size="small"
      class="m-b-10 transparent"
    />
    <el-tree
      class="transparent"
      node-key="id"
      highlight-current
      show-checkbox
      ref="tree"
      :filter-node-method="filterNode"
      :data="neatTree"
      :indent="12"
      @node-click="nodeClick"
    >
      <template v-slot="{ node, data }">
        <span class="justify-between w-100">
          
          <span class="el-tree-node__label align-center">
            {{ data.tag }} - {{ data.id }}
          </span>
          
          <span>
            <visibility v-if="data.tag !== 'grid-item'" :id="data.id" />
            
            <el-button
              type="text"
              size="mini"
              icon="el-icon-attract"
            />
            
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
import clone from 'clone'
import { mapState, mapGetters } from 'vuex'
import { traversal } from '../../utils/util'
import { vmMap } from '../../utils/vmMap'
import Visibility from './Visibility'
import globalStatus from '../../observable/globalStatus'

export default {
  name: 'NodesTree',
  components: {
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
      return data.tag.indexOf(value) !== -1
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
