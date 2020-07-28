<template>
  <div class="p-r-10 fake-transform">
    <div>
      <el-button type="text">Art Boards</el-button>
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        size="small"
        class="m-b-10 transparent"
      />

      <dialog-component-set
        v-if="projectId"
        :parent-id="projectId"
        button-text="Create Board"
      />

      <el-tree
        ref="tree"
        :data="rootComponentSets"
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
            :icon="icon[node.kind]"
            type="text"
            class="m-r-10"
          >
            {{ node.label }} - {{ shortId(node.id) }}
          </el-button>

          <transition name="fade">
            <span v-if="hoveredId === node.id">
              <!--              <dialog-folder-->
              <!--                v-if="isProject(node)"-->
              <!--                :parent-id="node.id"-->
              <!--                class="m-l-5"-->
              <!--              />-->

              <dialog-delete
                v-if="isComponentSet(node) || isFolder(node)"
                :id="node.id"
                class="m-l-5"
              />

              <component
                :key="node.updatedAt"
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
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions } from 'vuex'
import { NODE_TYPE, NODE_TYPE_STRING, KIND } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import { kebabCase } from '@/utils/string'
import { shortId } from '@/utils/node'

import { isComponentSet, isProject, isFolder, typeString } from '@/utils/node'
import dblClick from '@/utils/dblClick'

export default {
  name: 'PanelProject',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogFolder,
    DialogDelete
  },
  data() {
    return {
      filterText: '',
      NODE_TYPE_STRING,
      ...NODE_TYPE,
      hoveredId: null
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentSetIds']),
    ...mapState('component', ['rootComponentSetIds']),
    projectId() {
      return this.$route.params.projectId
    },
    icon() {
      return {
        [NODE_TYPE.PROJECT]: 'el-icon-files',
        [NODE_TYPE.FOLDER]: 'el-icon-folder-opened',
        [NODE_TYPE.COMPONENT_SET]: 'el-icon-lollipop'
      }
    },
    rootComponentSets() {
      return this.rootComponentSetIds.map(id => {
        const { children, ...node } = this.componentsMap[id]
        return node
      })
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
    shortId,
    ...mapActions('app', [
      'toggleSelectedComponentSetInIds',
      'toggleSelectedComponentSetId'
    ]),
    ...mapActions('component', ['modifyProjectNodeParent']),
    nodeParentChange({ data: childData }, { data: parentData }, action) {
      if (action === 'inner') {
        this.modifyProjectNodeParent({
          parentId: parentData.id,
          id: childData.id
        })
      }
    },
    nodeClick(event, node) {
      if (NODE_TYPE.COMPONENT_SET === node[KIND]) {
        dblClick(
          () => {
            if (event.ctrlKey || event.metaKey) {
              this.toggleSelectedComponentSetInIds(node.id)
            } else {
              this.toggleSelectedComponentSetId(node.id)
            }
          },
          () => {
            if (!this.selectedComponentSetIds.includes(node.id)) {
              this.toggleSelectedComponentSetInIds(node.id)
            }
            // this.selectedComponentSet = node
          }
        )
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
