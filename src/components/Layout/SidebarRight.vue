<template>
  <div class="sidebar-right">
    <portal-target
      name="ViewPort"
      class="inline-block m-l-15"
    />
    <node-info
      v-if="theOnlySelectedComponentId"
      :id="theOnlySelectedComponentId"
      class="text-center block"
      show-family
    />

    <div class="settings">
      <el-collapse
        v-model="activeNames"
        class="no-border"
      >
        <el-collapse-item
          title="Setting"
          name="2"
        >
          <panel-settings class="panel" />
        </el-collapse-item>
        <el-collapse-item
          title="Style"
          name="1"
        >
          <panel-styles
            v-if="theOnlySelectedComponentId"
            :id="theOnlySelectedComponentId"
            class="panel"
          />
        </el-collapse-item>
      </el-collapse>
    </div>

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
  </div>
</template>

<script>
import { Collapse, CollapseItem } from 'element-ui'
import { mapGetters } from 'vuex'
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'
import NodeInfo from '../TemplateUtils/NodeInfo'

export default {
  name: 'SidebarRight',
  components: {
    NodeInfo,
    PanelStyles,
    PanelSettings,
    ElCollapse: Collapse,
    ElCollapseItem: CollapseItem
  },
  data() {
    return {
      activeNames: ['1', '2']
    }
  },
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId'])
  }
}
</script>

<style scoped lang="scss">
.sidebar-right {
  padding-right: 10px;
  width: 320px;
  overflow: auto;
  position: fixed;
  top: 0;
  left: calc(100vw - 360px);
}

::v-deep {
  .el-collapse-item__header {
    border-bottom: none;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  h4 {
    margin: 5px 0;
  }
  .el-form-item__label {
    color: #606266;
    font-size: 12px;
    line-height: 18px;
  }
}

.settings {
  @include calc-vh('height', '100vh - 70px');
  overflow: scroll;
}

</style>
