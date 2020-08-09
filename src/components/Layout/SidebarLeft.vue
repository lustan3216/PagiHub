<template>
  <multipane
    class="sidebar-left"
    layout="horizontal"
  >
    <div class="extra justify-between">
      <el-button type="text">Component Set</el-button>

      <dialog-component-set
        v-if="projectId"
        :parent-id="projectId"
        button-text="Create"
        button-type="primary"
      />
    </div>

    <panel-project
      v-if="isLogin"
      class="panel"
      style="height: 40%;"
    />

    <multipane-resizer />

    <el-input
      v-shortkey.avoid
      v-model="filterText"
      placeholder="Search Node"
      size="small"
      class="extra transparent"
    />

    <panel-nodes
      :filter-text="filterText"
      class="panel"
      style="height:90%;"
    />
  </multipane>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelNodes from '../Setup/PanelNodes'
import PanelProject from '../Setup/PanelProject'
import { Multipane, MultipaneResizer } from 'vue-multipane'
import DialogComponentSet from '../Setup/DialogComponentSet'

export default {
  name: 'SidebarLeft',
  components: {
    PanelNodes,
    PanelProject,
    DialogComponentSet,
    Multipane,
    MultipaneResizer
  },
  data() {
    return {
      filterText: ''
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
    projectId() {
      return this.$route.params.projectId
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar-left {
  width: 260px;
  background-color: white;
  border-right: 1px solid $color-grey;
}

.panel {
  padding: 5px;
  background-color: #fff;
  overflow: scroll;
}

.extra {
  padding: 5px;
  width: calc(100% - 10px);
}

::v-deep.layout-h .multipane-resizer {
  height: 8px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  top: 0;

  &::before {
    margin-top: -2px;
    transform: translateX(-50%);
    width: 30px;
    height: 1px;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: rgba(0, 0, 0, 0.15);
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
  }

  &::after {
    margin-top: 1px;
    transform: translateX(-50%);
    width: 30px;
    height: 1px;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: rgba(0, 0, 0, 0.15);
    -webkit-transition: background-color 0.3s;
    transition: background-color 0.3s;
  }
}
</style>
