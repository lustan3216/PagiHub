<template>
  <div class="sidebar-right">
    <i
      v-shortkey="['a']"
      @shortkey="activeName = 'Project'"
    />
    <i
      v-shortkey="['s']"
      @shortkey="activeName = 'Nodes'"
    />
    <i
      v-shortkey="['d']"
      @shortkey="activeName = 'Setting'"
    />
    <i
      v-shortkey="['f']"
      @shortkey="activeName = 'Style'"
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
        <panel-project class="panel" />
      </el-tab-pane>

      <el-tab-pane
        label="Nodes"
        name="Nodes"
        lazy
      >
        <panel-nodes
          v-if="activeName === 'Nodes'"
          class="panel"
        />
      </el-tab-pane>

      <el-tab-pane
        label="Setting"
        name="Setting"
        lazy
      >
        <panel-settings
          v-if="activeName === 'Setting'"
          class="panel"
        />
      </el-tab-pane>

      <el-tab-pane
        label="Style"
        name="Style"
        lazy
      >
        <panel-styles
          v-if="activeName === 'Style'"
          class="panel"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'

export default {
  name: 'SidebarRight',
  components: {
    PanelStyles,
    PanelSettings,
    PanelNodes: () => import('../Setup/PanelNodes'),
    PanelProject: () => import('../Setup/PanelProject')
  },
  data() {
    return {
      isFloat: false,
      activeName: 'Nodes'
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar-right {
  padding-right: 10px;
  width: 320px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: calc(100vw - 320px);
}

.panel {
  @include calc-vh(height, '100vh - 130px');
  overflow-y: scroll;
}
</style>
