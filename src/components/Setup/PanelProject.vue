<template>
  <div>
    <el-button type="text">Component Set</el-button>

    <dialog-component-set
      v-if="projectId"
      :parent-id="projectId"
      button-text="Create"
    />

    <el-tree
      ref="tree"
      :data="rootComponentSets"
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
          :class="{ selected: editingComponentSetId === node.id }"
          :icon="icon[node.kind]"
          type="text"
          class="m-r-10"
        >
          {{ node.label }} - {{ shortId(node.id) }}
        </el-button>

        <transition name="fade">
          <span v-if="hoveredId === node.id">
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
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions, mapMutations } from 'vuex'
import { NODE_TYPE, NODE_TYPE_STRING } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import { kebabCase } from '@/utils/string'
import { shortId } from '@/utils/node'
import { isComponentSet, isProject, isFolder, typeString } from '@/utils/node'

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
      NODE_TYPE_STRING,
      ...NODE_TYPE,
      hoveredId: null
    }
  },
  computed: {
    ...mapState('component', ['rootComponentSetIds', 'editingComponentSetId']),
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
  created() {
    const { projectId } = this.$route.params
    if (projectId) {
      this.getComponentSets(projectId)
      this.componentSet({
        editingProjectId: projectId
      })
    }
  },
  methods: {
    isComponentSet,
    isProject,
    isFolder,
    typeString,
    kebabCase,
    shortId,
    ...mapMutations('component', { componentSet: 'SET' }),
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('component', ['modifyProjectNodeParent', 'getComponentSets']),
    nodeParentChange({ data: childData }, { data: parentData }, action) {
      if (action === 'inner') {
        this.modifyProjectNodeParent({
          parentId: parentData.id,
          id: childData.id
        })
      }
    },
    nodeClick(event, node) {
      if (isComponentSet(node)) {
        this.SET_EDITING_COMPONENT_SET_ID(node.id)
      }
    },
    allowDrop(_, { data: node }, action) {
      return action === 'inner' && (this.isFolder(node) || this.isProject(node))
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
