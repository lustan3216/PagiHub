<template>
  <div id="sidebar-right">
    <el-button-group class="flex">
      <el-button
        icon="el-icon-brush"
        class="flex1"
        @click="activePanel = 'PanelStyles'"
      />

      <el-button
        icon="el-icon-setting"
        class="flex1"
        @click="activePanel = 'PanelSettings'"
      />
    </el-button-group>

    <div class="sidebar-right-content">
      <component :is="activePanel" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'
import NodeInfo from '../TemplateUtils/ComponentName'

export default {
  name: 'SidebarRight',
  components: {
    NodeInfo,
    PanelStyles,
    PanelSettings
  },
  data() {
    return {
      activePanel: 'PanelStyles'
    }
  }
}
</script>

<style scoped lang="scss">
#sidebar-right {
  width: 260px;
  background-color: white;
  border-left: 1px solid $color-grey;
}

::v-deep {
  .el-form-item {
    margin-bottom: 0;
  }
  h4 {
    margin: 5px 0;
  }
  .title {
    display: inline-block;
    position: relative;
    color: #606266;
    font-size: 12px;
  }

  .sub-title {
    padding-bottom: 0 !important;
    font-size: 12px;
    padding-right: 3px;
    color: #606266;
  }
  .el-form-item__label {
    color: #606266;
    font-size: 12px;
    line-height: 18px;
  }
  &.el-button-group {
    margin-left: -1px;
    & > button {
      border-color: $color-grey;
    }
  }

  &.sidebar-right-content {
    padding: 0 10px 10px;
    @include calc-vh('max-height', '100vh - 100px');
    overflow: scroll;

    .el-button--mini,
    .el-button--mini.is-round {
      padding: 7px;
    }
  }
}
</style>
