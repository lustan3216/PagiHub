<template>
  <div class="sidebar-right">
    <el-button-group>
      <el-button
        icon="el-icon-s-operation"
        @click="activePanel = 'PanelStyles'"
      />
      <el-button
        icon="el-icon-setting"
        @click="activePanel = 'PanelSettings'"
      />
    </el-button-group>

    <div class="sidebar-right-content">
      <component
        v-if="theOnlySelectedComponentId"
        :is="activePanel"
        :id="theOnlySelectedComponentId"
        class="panel"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'
import PanelExplain from '../Setup/PanelExplain'
import NodeInfo from '../TemplateUtils/NodeName'

export default {
  name: 'SidebarRight',
  components: {
    NodeInfo,
    PanelStyles,
    PanelSettings,
    PanelExplain
  },
  data() {
    return {
      activePanel: 'PanelStyles'
    }
  },
  computed: {
    ...mapGetters('app', ['theOnlySelectedComponentId'])
  }
}
</script>

<style scoped lang="scss">
.sidebar-right {
  width: 320px;
  padding: 10px 0;
  background-color: white;
  border-left: 1px solid $color-grey;
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

.sidebar-right-content {
  @include calc-vh('max-height', '100vh - 130px');
  overflow: scroll;
  padding: 15px 10px;
}
</style>
