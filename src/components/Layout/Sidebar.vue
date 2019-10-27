<template>
  <el-aside
    v-if="currentSidebar"
    class="sidebar">
    <el-row>
      <el-col
        :span="6"
        :offset="18">
        <el-button
          type="text"
          @click="closeSidebar">
          <v-icon name="times" />
        </el-button>
      </el-col>
    </el-row>

    <component
      :is="currentSidebar"
      :id="id" />
  </el-aside>
</template>

<script>
import { onSidebar, closeSidebar } from '../../buses/sidebar'
import SidebarTemplates from '../../components/Layout/SidebarTemplates'
import SidebarSettings from '../../components/Layout/SidebarSettings'
import SidebarNodesTree from '../../components/Layout/SidebarNodesTree'

export default {
  name: 'Sidebar',
  components: {
    SidebarTemplates,
    SidebarSettings,
    SidebarNodesTree
  },
  data() {
    return {
      currentSidebar: null,
      sidebarPayload: {}
    }
  },
  async created() {
    onSidebar(({ is, id }) => {
      this.currentSidebar = is
      this.id = id
    })
  },
  methods: {
    closeSidebar
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}

::v-deep {
  .el-menu {
    border-right: none;
  }
  .el-submenu .el-menu-item {
    height: inherit;
  }
}
.sidebar {
  background-color: #fff;
  box-shadow: 2px 0px 5px 0 rgba(32, 48, 60, 0.05);
  width: 350px !important;
}
</style>
