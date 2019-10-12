<template>
  <sidebar>
    <el-menu ref="menu">
      <nested-menu
        v-for="node in tree"
        :node="node"
        :key="node.id"
        :active-id="currentId"
        @onClick="onClick" />
    </el-menu>
  </sidebar>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from './Sidebar'
import NestedMenu from './Components/NestedMenu'
import { openEditBarById, store } from '../../buses/editBar'

export default {
  name: 'SidebarNodesTree',
  components: {
    NestedMenu,
    Sidebar
  },
  computed: {
    ...mapGetters('nodes', ['tree']),
    currentId() {
      return Array.last(store.currentIds)
    }
  },
  watch: {
    currentId(id) {
      const { menu } = this.$refs
      id = id.toString()
      menu.activeIndex = id
      if (menu.items[id]) {
        const { indexPath } = menu.items[id]
        menu.open(indexPath[indexPath.length - 2]) // 取到該節點的爸爸，也就是最後面往前推一個index
      } else {
        menu.open(id)
      }
    }
  },
  methods: {
    onClick(id) {
      this.$refs.menu.activeIndex = id.toString()
      openEditBarById(id)
    }
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
