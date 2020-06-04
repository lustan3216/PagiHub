<template>
  <div class="p-r-10 fake-transform">
    <div v-show="!selectedComponentSet">
      <el-button type="text">Art Boards</el-button>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        size="small"
        class="m-b-10 transparent"
      />
      <el-tree
        ref="tree"
        :data="innerTree"
        :filter-node-method="filterTagBySearching"
        :indent="16"
        :allow-drop="allowDrop"
        class="tree"
        node-key="id"
        draggable
        check-strictly
        @node-drop="nodeParentChange"
      >
        <span
          slot-scope="{ data: node }"
          class="justify-between align-center w-100 node"
          @click="nodeClick($event, node)"
          @mouseenter="hoveredId = node.id"
        >
          <el-button
            :class="{ selected: selectedComponentSetIds.includes(node.id) }"
            :icon="icon[node.type]"
            type="text"
            class="m-r-10"
          >
            {{ node.name }} {{ node.id }}
          </el-button>

          <transition name="fade">
            <span v-if="hoveredId === node.id">
              <dialog-folder
                v-if="isProject(node)"
                :parent-id="node.id"
                class="m-l-5"
              />

              <dialog-component-set
                v-if="isProject(node) || isFolder(node)"
                :parent-id="node.id"
                class="m-l-5"
              />

              <dialog-delete
                v-if="isComponentSet(node) || isFolder(node)"
                :id="node.id"
                class="m-l-5"
              />

              <component
                :id="node.id"
                :parent-id="node.parentId"
                :is="`dialog-${kebabCase(typeString(node))}`"
                class="m-l-5"
              />
            </span>
          </transition>
        </span>
      </el-tree>
    </div>

    <template v-if="selectedComponentSet">
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="selectedComponentSet = null"
      >
        {{ name }}
      </el-button>
      <panel-nodes :selected-component-set-id="selectedComponentSet.id"/>
    </template>

  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { NODE_TYPE, NODE_TYPE_STRING } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import { kebabCase } from '@/utils/string'
import { shortTagName, isComponent, isComponentSet, isProject, isFolder, typeString } from '@/utils/node'
import PanelNodes from './PanelNodes'
import { cloneJson, traversal } from '@/utils/tool'
import dblClick from '@/utils/dblClick'

export default {
  name: 'PanelProject',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogFolder,
    DialogDelete,
    PanelNodes
  },
  data() {
    return {
      filterText: '',
      NODE_TYPE_STRING,
      ...NODE_TYPE,
      hoveredId: null,
      selectedComponentSet: null
    }
  },
  computed: {
    ...mapGetters('project', ['tree']),
    ...mapState('app', ['selectedComponentSetIds']),
    name() {
      return shortTagName(this.selectedComponentSet)
    },
    icon() {
      return {
        [NODE_TYPE.PROJECT]: 'el-icon-files',
        [NODE_TYPE.FOLDER]: 'el-icon-folder-opened',
        [NODE_TYPE.COMPONENT_SET]: 'el-icon-lollipop'
      }
    },
    innerTree() {
      const cloneTree = cloneJson(this.tree)
      traversal(cloneTree, (node) => {
        delete node.w
        delete node.h
      })

      return cloneTree
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    isComponentSet,
    isProject,
    isFolder,
    typeString,
    kebabCase,
    ...mapActions('project', ['modifyProjectNodeParent']),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapMutations('app', [
      'TOGGLE_SELECTED_COMPONENT_SET_IN_IDS',
      'TOGGLE_SELECTED_COMPONENT_SET_ID'
    ]),
    nodeParentChange({ data: childData }, { data: parentData }, action) {
      if (action === 'inner') {
        this.modifyProjectNodeParent({
          parentId: parentData.id,
          id: childData.id
        })
      }
    },
    nodeClick(event, node) {
      if (NODE_TYPE.COMPONENT_SET === node.type) {
        dblClick(() => {
          if (event.ctrlKey || event.metaKey) {
            this.TOGGLE_SELECTED_COMPONENT_SET_IN_IDS(node.id)
          } else {
            this.TOGGLE_SELECTED_COMPONENT_SET_ID(node.id)
          }
        }, () => {
          if (!this.selectedComponentSetIds.includes(node.id)) {
            this.TOGGLE_SELECTED_COMPONENT_SET_IN_IDS(node.id)
          }
          this.selectedComponentSet = node
        })
      }
    },
    allowDrop(_, { data: node }, action) {
      return action === 'inner' && (this.isFolder(node) || this.isProject(node))
    },
    filterTagBySearching(value, data) {
      value = value.toLowerCase().toString()
      return data.name.toLowerCase().indexOf(value) !== -1
    }
  }
}
</script>

<style scoped lang="scss">
.selected {
  background: aliceblue;
  border-radius: 3px;
}

.node {
  padding-left: 5px;
}

.tree {
  background: transparent;
  overflow: scroll;
}

::v-deep.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border-color: transparent;
  color: #c0c4cc;
}
</style>
