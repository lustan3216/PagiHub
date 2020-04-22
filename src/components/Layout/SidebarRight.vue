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
          v-if="selectedComponentIds.length && activeName === 'Style'"
          class="panel"
        />
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
    PanelNodes: () => import('../Setup/PanelNodes'),
    PanelProject: () => import('../Setup/PanelProject')
  },
  data() {
    return {
      isFloat: false,
      activeName: 'Nodes'
    }
  },
  computed: {
    ...mapState('draft', ['selectedComponentSetId']),
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

<style scoped lang="scss">
.sidebar-right {
  padding-right: 10px;
  width: 320px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: calc(100vw - 320px);
  z-index: 201;
}

.panel {
  @include calc-vh(height, '100vh - 95px');
  overflow-y: scroll;
}

.float {
  padding: 0 10px 20px;
  background: rgba(255, 255, 255, 0.87);
  box-shadow: 1px 1px 19px 6px rgba(0, 0, 0, 0.1);
}
</style>
