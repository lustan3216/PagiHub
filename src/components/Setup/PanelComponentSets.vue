<template>
  <div class="wh-100 flex-column">
    <div class="justify-between align-center">
      <b class="small-title m-l-10">Pages</b>
      <dialog-component-set
        v-if="editingProjectId"
        ref="dialogComponentSet"
        :first-time="!componentSetIds.length"
        style="font-size: 18px; color: #409EFF;"
        size="mini"
      />
    </div>

    <div class="over-scroll">
      <div
        v-for="componentSet in componentSets"
        v-if="componentSet && componentSet.id"
        :key="componentSet.id"
        :class="{
          selected: hoverId === componentSet.id,
          active: editingComponentSetId === componentSet.id
        }"
        class="relative w-100 over-hidden border-box flex-center"
        style="transition: all 0.3s;"
        @click="nodeClick($event, componentSet)"
        @mouseenter="mouseenter(componentSet.id)"
        @mouseleave="mouseleave"
      >
        <publish-link
          :id="componentSet.id"
          :key="componentSet.isPrivate + componentSet.version"
          class="upload-icon"
          style="line-height: 0;"
        />

        <component-name
          :id="componentSet.id"
          class="w-100 text-left"
        />

        <transition name="fade">
          <div
            v-if="componentSet.id === hoverId"
            class="controller"
          >
            <dialog-delete
              :id="componentSet.id"
              @open="visible = true"
              @close="visible = false"
            />

            <dialog-component-set
              :key="componentSet.updatedAt"
              :id="componentSet.id"
              type="text"
              @open="visible = true"
              @close="visible = false"
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
import PublishLink from '@/components/Components/PublishLink'
import ComponentName from '../TemplateUtils/ComponentName'
import DialogComponentSet from '@/components/Setup/DialogComponentSet'
import { getValueByPath } from '@/utils/tool'


export default {
  name: 'PanelComponentSets',
  components: {
    PublishLink,
    DialogComponentSet,
    ElTree: Tree,
    DialogProject,
    PanelComponentSets,
    DialogDelete,
    ComponentName
  },
  data() {
    return {
      hoverId: null,
      visible: false
    }
  },
  computed: {
    ...mapState('node', ['editingProjectId', 'editingComponentSetId']),
    ...mapGetters('node', ['projectNodes']),
    componentSetIds() {
      const project = this.nodesMap[this.editingProjectId]
      return project ? project.children.map(node => node.id) : []
    },
    componentSets() {
      // components可能會因為Example裡面的跟當下project的混在一起
      return this.componentSetIds
        .map(id => this.nodesMap[id])
        .sort((a, b) => b.label - a.label)
    }
  },
  async mounted() {
    const { projectId } = this.$route.params

    if (!projectId) {
      this.$router.push({ name: 'Projects' })
    }

    await this.getProject(projectId)

    this.$nextTick(() => {
      if (!this.nodesMap[projectId]) {
        this.$router.push({ name: 'Projects' })
      }

      this.NODE_SET({ editingProjectId: projectId })

      if (this.editingComponentSetId) {
        // preview mode 回來時
        return
      }

      this.getAssets(projectId)

      const id = getValueByPath(this.componentSets, [0, 'id'])
      if (id) {
        this.NODE_SET({ editingComponentSetId: id })
      }
      else {
        this.$refs.dialogComponentSet.open()
      }
    })
  },
  methods: {
    ...mapMutations('app', { APP_SET: 'SET' }),
    ...mapMutations('node', { NODE_SET: 'SET' }),
    ...mapMutations('app', ['SET_SELECTED_COMPONENT_ID']),
    ...mapMutations('node', ['SET_EDITING_COMPONENT_SET_ID']),
    ...mapActions('node', ['getProject']),
    ...mapActions('asset', ['getAssets']),
    nodeClick(event, node) {
      this.SET_EDITING_COMPONENT_SET_ID(node.id)
      this.APP_SET({ selectedComponentIds: [] })
    },
    mouseenter(id) {
      this.hoverId = id
      this.visible = false
    },
    mouseleave() {
      if (this.visible) return
      this.hoverId = null
    }
  }
}
</script>

<style scoped lang="scss">
.active {
  background: #f0f7ff;
}
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
.upload-icon {
  width: 20px;
  text-align: center;
  margin-left: 10px;
}
</style>
