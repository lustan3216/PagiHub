<template>
  <div
    v-if="editingProjectId"
    class="flex-column wh-100"
  >
    <div class="m-b-10 justify-between">
      <el-button
        type="text"
        class="no-border small-title"
        icon="el-icon-arrow-left"
        @click="$emit('update:visible', false)"
      >
        {{ projectName }}
      </el-button>

      <dialog-component-set
        :parent-id="editingProjectId"
        button-text="Design"
        button-type="primary"
      />
    </div>

    <el-tree
      ref="tree"
      :data="componentSets"
      :indent="16"
      class="tree"
      node-key="id"
      draggable
      check-strictly
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
            class="w-100 text-left"
          />

          <transition name="fade">
            <div
              v-if="data.id === hoverId"
              class="controller"
            >
              <dialog-delete :id="data.id" />

              <dialog-component-set
                :key="data.updatedAt"
                :id="data.id"
                :parent-id="editingProjectId"
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
import DialogComponentSet from './DialogComponentSet'
import DialogDelete from './DialogDelete'
import ComponentName from '../TemplateUtils/ComponentName'
import { kebabCase } from '@/utils/string'
import {
  isComponentSet,
  isProject,
  cloneJsonWithoutChildren
} from '@/utils/node'

export default {
  name: 'PanelPages',
  components: {
    ElTree: Tree,
    DialogComponentSet,
    DialogProject,
    DialogDelete,
    ComponentName
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      ...NODE_TYPE,
      hoverId: null
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId', 'editingComponentSetId']),
    componentSets() {
      return Object.values(this.componentsMap)
        .filter(node => node.parentId === this.editingProjectId)
        .map(node => cloneJsonWithoutChildren(node))
    },
    projectName() {
      return this.componentsMap[this.editingProjectId].label
    }
  },
  watch: {
    editingProjectId: {
      handler(projectId) {
        if (projectId) {
          this.getComponentSets({ projectId })
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['getComponentSets']),
    isProject,
    kebabCase,
    nodeClick(event, node) {
      if (isComponentSet(node)) {
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
