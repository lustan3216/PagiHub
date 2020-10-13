<template>
  <div id="sidebar-right">
    <div class="sidebar-right-content">
      <panel-styles />
      <panel-settings />
    </div>
  </div>
</template>

<script>
import PanelStyles from '../Setup/PanelStyles'
import PanelSettings from '../Setup/PanelSettings'

export default {
  name: 'SidebarRight',
  components: {
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
  user-select: none;
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
    height: 100%;

    .el-button--mini,
    .el-button--mini.is-round {
      padding: 7px;
    }
  }
}

::v-deep {
  .divider-with-button {
    display: flex;
    & > .el-dropdown {
      margin-top: 6px;
      margin-left: 10px;
    }

    .el-button {
      border-color: transparent;
      padding: 3px !important;
    }
  }

  .el-divider--horizontal {
    margin: 15px 0 15px;
  }

  .el-divider__text {
    font-size: 12px;
    left: -20px;
  }
}
</style>
