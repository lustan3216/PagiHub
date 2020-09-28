<template>
  <div class="wh-100 flex-column">
    <div class="justify-between align-center">
      <b class="small-title m-l-10">Pages</b>
      <dialog-component-set
        v-if="editingProjectId"
        style="font-size: 18px; color: #409EFF;"
        size="mini"
      />
    </div>

    <div class="over-scroll">
      <div
        v-for="componentSet in componentSets"
        v-if="componentSet && componentSet.id"
        :key="componentSet.id"
        :class="{ selected: hoverId === componentSet.id }"
        class="relative w-100 over-hidden border-box"
        style="transition: all 0.3s; padding-left: 15px;"
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
        // components可能會因為Example裡面的跟當下project的混在一起
      }
    }
  },
  async created() {
    const { projectId } = this.$route.params

    if (!projectId) {
      this.$router.push({ name: 'Projects' })
    }

    await this.getProject(projectId)

    this.$nextTick(() => {
      const id = getValueByPath(this.componentSets, [0, 'id'])
      if (id) {
        this.SET_EDITING_COMPONENT_SET_ID(id)
      }
    })
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('node', { NODE_SET: 'SET' }),
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
