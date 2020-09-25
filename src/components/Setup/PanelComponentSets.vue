<template>
  <div class="wh-100">
    <div class="justify-between align-center">
      <b class="small-title">Pages</b>
      <dialog-component-set
        v-if="editingProjectId"
        class="gray-font font-14"
      />
    </div>

    <div
      v-for="componentSet in componentSets"
      v-if="componentSet && componentSet.id"
      :key="componentSet.id"
      :class="{ selected: hoverId === componentSet.id }"
      class="relative w-100 over-hidden border-box p-l-10"
      style="transition: all 0.3s;"
      @click="nodeClick($event, componentSet)"
      @mouseenter="hoverId = componentSet.id"
    >
      <component-name
        :id="componentSet.id"
        class="w-100 text-left"
      />

      <transition name="fade">
        <div
          v-if="componentSet.id === hoverId"
          class="controller"
        >
          <dialog-delete :id="componentSet.id" />

          <dialog-component-set
            :key="componentSet.updatedAt"
            :id="componentSet.id"
            type="text"
          />
        </div>
      </transition>
    </div>
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
import { cloneJsonWithoutChildren, getNode } from '@/utils/node'
import { getValueByPath } from '@/utils/tool'
import localforage from 'localforage'

export default {
  name: 'PanelComponentSets',
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
    componentSets() {
      const project = getNode(this.editingProjectId)
      if (project) {
        return cloneJsonWithoutChildren(project.children).sort(
          (a, b) => b.label - a.label
        )
      }
    }
  },
  async created() {
    const currentProjectId = await localforage.getItem('currentProjectId')
    const promise1 = localforage.getItem('currentComponentSetId')
    const promise2 = this.getProject(currentProjectId)
    const [componentSetId, _] = await Promise.all([promise1, promise2])

    if (componentSetId) {
      this.SET_EDITING_COMPONENT_SET_ID(componentSetId)
    }
    else {
      this.$nextTick(() => {
        const id = getValueByPath(this.componentSets, [0, 'id'])
        if (id) {
          this.SET_EDITING_COMPONENT_SET_ID(id)
        }
      })
    }
  },
  methods: {
    ...mapMutations('app', {
      APP_SET: 'SET'
    }),
    ...mapMutations('node', {
      NODE_SET: 'SET'
    }),
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['getProject']),
    nodeClick(event, node) {
      this.APP_SET({ selectedComponentIds: [] })
      this.SET_EDITING_COMPONENT_SET_ID(node.id)
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
  top: -1px;
  text-align: right;
  background: #f5f7fa;
  padding: 0 5px;
  height: 26px;
}
</style>
