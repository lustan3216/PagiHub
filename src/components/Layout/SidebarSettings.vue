<template>
  <sidebar @click.native="asd">
    <el-form />
  </sidebar>
</template>

<script>
// 永遠只會從EditBar裡面用bus.emit('currentSidebar')傳原始 style 過來
import Sidebar from './Sidebar'
import { emitSettingChange } from '../../buses/settings'

export default {
  name: 'SidebarSettings',
  components: {
    Sidebar
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    styles: {
      type: Object,
      required: true
    }
  },
  methods: {
    asd() {
      this.updateStyle()
    },
    updateStyle() {
      emitSettingChange(this.id, {
        styles: { background: 'black' }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: inherit;
}
.el-submenu .el-menu-item {
  height: inherit;
}
</style>
