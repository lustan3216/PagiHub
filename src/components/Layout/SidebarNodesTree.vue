<template>
  <sidebar>
    <el-menu>
      <nested-menu
        v-for="node in nodesTree"
        :node="node"
      />
    </el-menu>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './Sidebar'
import NestedMenu from '../Components/NestedMenu'

export default {
  name: 'SidebarNodesTree',
  components: {
    NestedMenu,
    Sidebar
  },
  data() {
    return {
      openedMenu: null
    }
  },
  computed: {
    ...mapGetters('nodes', ['nodesTree'])
  }
}
</script>

<style scoped lang="scss">
::v-deep > .el-carousel__container {
  height: auto;
  padding-top: 60%;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
</style>
