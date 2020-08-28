<template>
  <panel-pages
    v-if="isPanelPages && editingProjectId"
    :visible.sync="isPanelPages"
  />

  <div
    v-else
    class="flex-column h-100"
  >
    <div class="m-b-10 justify-between">
      <el-button
        type="text"
        class="no-border small-title"
        icon="el-icon-arrow-right"
        @click="isPanelPages = true"
      >Websites</el-button>

      <dialog-project
        button-text="Website"
        button-type="primary"
      />
    </div>

    <el-tree
      ref="tree"
      :data="projects"
      :indent="12"
      class="tree"
      node-key="id"
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
            icon="el-icon-files"
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
import { mapState, mapActions, mapMutations } from 'vuex'
import DialogProject from './DialogProject'
import PanelPages from './PanelPages'
import DialogDelete from './DialogDelete'
import ComponentName from '../TemplateUtils/ComponentName'
import { isProject } from '@/utils/node'

export default {
  name: 'PanelProjects',
  components: {
    ElTree: Tree,
    DialogProject,
    PanelPages,
    DialogDelete,
    ComponentName
  },
  data() {
    return {
      hoverId: null,
      isPanelPages: false
    }
  },
  computed: {
    ...mapState('node', ['projectIds', 'editingProjectId']),
    projects() {
      return this.projectIds
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
  created() {
    this.getProjects()
  },
  methods: {
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['getProjects']),
    isProject,
    nodeClick(event, node) {
      this.isPanelPages = true
      this.NODE_SET({
        editingProjectId: node.id
      })
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
