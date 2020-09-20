<template>
  <div class="wh-100">
    <div class="m-b-10 justify-between">
      <el-button-group>
        <dialog-project
          button-text="Project"
          button-type="primary"
        />

        <dialog-component-set
          button-text="Component"
          button-type="primary"
        />
      </el-button-group>
    </div>

    <el-tree
      ref="tree"
      :data="innerTree"
      :indent="12"
      class="tree"
      node-key="id"
      default-expand-all
      check-strictly
    >
      <template v-slot="{ data }">
        <div
          v-if="data && data.id"
          :class="{ selected: editingProjectId === data.id }"
          class="relative w-100 over-hidden"
          @click="nodeClick($event, data)"
          @mouseenter="hoverId = data.id"
        >
          <component-name
            :id="data.id"
            :icon="`el-icon-${data.isComponentSet ? 'copy-document' : 'files'}`"
            class="w-100 text-left"
          />

          <transition name="fade">
            <div
              v-if="data.id === hoverId"
              class="controller"
            >
              <dialog-delete :id="data.id" />

              <dialog-project
                :key="data.updatedAt"
                :id="data.id"
                type="text"
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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import DialogProject from './DialogProject'
import PanelComponentSets from './PanelComponentSets'
import DialogDelete from './DialogDelete'
import ComponentName from '../TemplateUtils/ComponentName'
import DialogComponentSet from '@/components/Setup/DialogComponentSet'
import {
  isProject,
  isComponentSet,
  traversalSelfAndChildren,
  cloneJsonWithoutChildren
} from '@/utils/node'

export default {
  name: 'PanelProjects',
  components: {
    DialogComponentSet,
    ElTree: Tree,
    DialogProject,
    PanelComponentSets,
    DialogDelete,
    ComponentName
  },
  data() {
    return {
      hoverId: null
    }
  },
  computed: {
    ...mapState('node', ['projectIds', 'editingProjectId']),
    ...mapGetters('node', ['projectNodes']),
    innerTree() {
      const tree = []

      traversalSelfAndChildren(this.projectNodes, (node, parentNode) => {
        if (isProject(node)) {
          tree.push(node)
        }
        else if (isComponentSet(node)) {
          const index = parentNode.children.findIndex(x => x.id === node.id)
          const componentSet = cloneJsonWithoutChildren(node)
          componentSet.isComponentSet = true
          parentNode.children[index] = componentSet
        }
      })

      return tree.sort((a, b) => b.updatedAt - a.updatedAt)
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['getProjects', 'getComponentSets']),
    isProject,
    nodeClick(event, node) {
      if (isProject(node)) {
        this.NODE_SET({ editingProjectId: node.id })
      }
      else if (isComponentSet(node)) {
        this.APP_SET({ selectedComponentIds: [] })
        this.NODE_SET({ editingProjectId: node.parentId })
        this.SET_EDITING_COMPONENT_SET_ID(node.id)
      }
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
