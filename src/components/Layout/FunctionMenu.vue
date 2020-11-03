<template>
  <div>
    <el-menu
      active-index="2"
      mode="horizontal"
      @select="() => {}"
    >
      <el-submenu index="2">
        <template slot="title">Dashboard</template>
        <el-menu-item index="2-1">Help</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">Edit</template>
          <el-menu-item index="2-4-1">Redo</el-menu-item>
          <el-menu-item index="2-4-1">Undo</el-menu-item>
          <el-menu-item index="2-4-1">Delete</el-menu-item>
          <el-menu-item index="2-4-1">Copy</el-menu-item>
          <el-menu-item index="2-4-2">Pasty</el-menu-item>
          <el-menu-item index="2-4-3">Delete</el-menu-item>
          <el-menu-item index="2-4-3">Cut</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'c']"
      :disabled="!selectedComponentIds.length"
      @shortkey="setCopySelectedNodeId(null)"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'v']"
      :disabled="!copyComponentIds.length"
      @shortkey="vmPasteNodes"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'b']"
      @shortkey="vmCreateEmptyItem"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'x']"
      :disabled="selectedComponentIds.length !== 1"
      @shortkey="cut"
    />

    <i
      v-shortkey="{ del: ['del'], del: ['backspace'] }"
      :disabled="!selectedComponentIds.length"
      @shortkey="multiDelete"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
      @shortkey="UNDO"
      @click="UNDO"
    />

    <i
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
      @shortkey="REDO"
      @click="REDO"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { isMac } from '@/utils/device'
import { vmCreateEmptyItem, vmPasteNodes, vmRemoveNode } from '@/utils/vmMap'
import { arrayLast } from '@/utils/array'
import { Menu, MenuItem, Submenu } from 'element-ui'

export default {
  name: 'FunctionMenu',
  components: {
    ElMenu: Menu,
    ElMenuItem: MenuItem,
    ElSubmenu: Submenu
  },
  computed: {
    ...mapState('app', ['copyComponentIds', 'selectedComponentIds']),
    ...mapGetters('app', ['selectedComponentNodes'])
  },
  methods: {
    ...mapMutations('node', ['REDO', 'UNDO']),
    isMac,
    vmPasteNodes,
    vmCreateEmptyItem() {
      vmCreateEmptyItem(arrayLast(this.selectedComponentNodes))
    },
    multiDelete() {
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    },
    cut() {
      this.setCopySelectedNodeId(this.selectedComponentIds)
      this.selectedComponentNodes.forEach(node => vmRemoveNode(node))
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-menu {
  border-bottom: none;
  .el-submenu__title {
    height: 44px;
    line-height: 44px;
    font-size: 12px;
    border-bottom: none;
  }

  .el-submenu__icon-arrow {
    margin-top: -1px;
  }
}
</style>
