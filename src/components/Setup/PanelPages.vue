<template>
  <div class="flex-column h-100">
    <div class="m-b-10 justify-between">
      <el-button type="text">Pages</el-button>

      <!--      <dialog-component-set-->
      <!--        v-if="projectId"-->
      <!--        :parent-id="projectId"-->
      <!--        button-text="Create"-->
      <!--        button-type="primary"-->
      <!--      />-->
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
          class="relative w-100 over-hidden"
          @click="nodeClick($event, data)"
          @mouseenter="hoverId = data.id"
        >
          <node-name
            :id="data.id"
            :icon="icon[data.kind]"
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
                :is="`dialog-${kebabCase(typeString(data))}`"
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
import { NODE_TYPE, NODE_TYPE_STRING } from '@/const'
import DialogProject from './DialogProject'
import DialogFolder from './DialogFolder'
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import NodeName from '../TemplateUtils/NodeName'
import { kebabCase } from '@/utils/string'
import { isComponentSet, isProject, isFolder, typeString } from '@/utils/node'

export default {
  name: 'PanelProject',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogFolder,
    DialogDelete,
    NodeName
  },
  data() {
    return {
      NODE_TYPE_STRING,
      ...NODE_TYPE,
      hoverId: null
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
  methods: {
    isComponentSet,
    isProject,
    isFolder,
    typeString,
    kebabCase,
    ...mapMutations('component', ['SET_EDITING_COMPONENT_SET_ID']),
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
