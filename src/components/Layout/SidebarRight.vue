<template>
  <component
    :is="isFloat ? 'DialogInteracted' : 'div'"
    :class="{ float: isFloat }"
    class="sidebar-right"
  >
    <el-button
      :icon="`el-icon${isFloat ? '-map' : ''}-location`"
      class="transparent"
      circle
      type="mini"
      @click="isFloat = !isFloat"
    />

    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        label="Project"
        name="Project"
        lazy
      >
        <tree-project />
      </el-tab-pane>

      <el-tab-pane
        label="Nodes"
        name="Nodes"
        lazy
      >
        <tree-nodes v-if="selectedComponentSetId" />
      </el-tab-pane>

      <el-tab-pane
        label="Setting"
        name="setting"
        lazy
      >
        <panel-settings />
      </el-tab-pane>

      <el-tab-pane
        label="Style"
        name="style"
        lazy
      >
        <panel-styles v-if="selectedComponentIds.length" />
      </el-tab-pane>
    </el-tabs>
  </component>
</template>

<script>
import formCreate from '@form-create/element-ui'
import { mapState, mapGetters } from 'vuex'
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'
import DialogInteracted from '@/components/Components/DialogInteracted'

export default {
  name: 'SidebarRight',
  components: {
    PanelStyles,
    PanelSettings,
    DialogInteracted,
    FormCreate: formCreate.$form(),
    TreeNodes: () => import('../Setup/TreeNodes'),
    TreeProject: () => import('../Setup/TreeProject')
  },
  data() {
    return {
      isFloat: false,
      activeName: 'Nodes'
    }
  },
  computed: {
    ...mapState('draft', ['nodesMap', 'selectedComponentSetId']),
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('app', ['theOnlySelectedComponentId'])
  },
  watch: {
    isFloat(value) {
      if (!value) {
        this.$el.style.webkitTransform = null
      }
    }
  }
}
</script>

<style>
.sidebar-right {
  padding-right: 10px;
  width: 300px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: calc(100vw - 300px);
  z-index: 300;
}

.float {
  padding: 0 10px 20px;
  background: rgba(255, 255, 255, 0.87);
  box-shadow: 1px 1px 19px 6px rgba(0, 0, 0, 0.1);
}
</style>
