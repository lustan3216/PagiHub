<template>
  <div class="flex-column h-100">
    <div class="m-b-10 justify-between">
      <el-button type="text">Website</el-button>

      <dialog-component-set
        v-if="projectId"
        :parent-id="projectId"
        button-text="Create"
        button-type="primary"
      />
    </div>

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
      <template v-slot="{ data }">
        <div
          v-if="data && data.id"
          :class="{ selected: editingComponentSetId === data.id }"
          class="relative w-100 over-hidden"
          @click="nodeClick($event, data)"
          @mouseenter="hoverId = data.id"
        >
          <component-name
            :id="data.id"
            :icon="icon[data.tag]"
            class="w-100 text-left"
          />

          <transition name="fade">
            <div
              v-if="data.id === hoverId"
              class="controller"
            >
              <dialog-delete
                v-if="isComponentSet(data) || isFolder(data)"
                :id="data.id"
              />

              <component
                :key="data.updatedAt"
                :id="data.id"
                :parent-id="data.parentId"
                :is="`dialog-${kebabCase(data.tag)}`"
              />
            </div>
          </transition>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { Tree } from 'element-ui'
import { mapState, mapActions, mapMutations } from 'vuex'
import { NODE_TYPE } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import ComponentName from '../TemplateUtils/ComponentName'
import { kebabCase } from '@/utils/string'
import { isComponentSet, isProject, isFolder } from '@/utils/node'

export default {
  name: 'PanelProject',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogDelete,
    ComponentName
  },
  data() {
    return {
      ...NODE_TYPE,
      hoverId: null
    }
  },
  computed: {
    ...mapState('node', ['rootComponentSetIds', 'editingComponentSetId']),
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
      return this.rootComponentSetIds
        .map(id => {
          const newNode = this.componentsMap[id]
          if (newNode) {
            const { children, ...node } = newNode
            return node
          }
        })
        .filter(node => node)
    }
  },
  methods: {
    isComponentSet,
    isProject,
    isFolder,
    kebabCase,
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['modifyProjectNodeParent']),
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
      return action === 'inner' && (isFolder(node) || isProject(node))
    }
  }
}
</script>

<style scoped lang="scss">
.selected {
  background: #f5f7fa;
  border-radius: 3px;
}

.node {
  padding-left: 5px;
}

.tree {
  overflow: scroll;
}

::v-deep.el-input.is-disabled .el-input__inner {
  background-color: transparent;
  border-color: transparent;
  color: #c0c4cc;
}
.controller {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 1px;
  text-align: right;
  background: #f5f7fa;
  padding: 0 5px;
  height: 26px;
}
</style>
