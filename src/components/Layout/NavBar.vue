<template>
  <div class="nav-bar flex-column">
    <el-button type="text" @click="CLOSE_SIDEBAR">
      <unicon fill="#909399" name="left-arrow-to-left" />
    </el-button>
    <el-button type="text" @click="OPEN_SIDEBAR('SidebarNodesTree')">
      <unicon fill="#909399" name="layer-group" />
    </el-button>
    <el-button type="text" @click="OPEN_SIDEBAR('SidebarNodesTree')">
      <unicon fill="#909399" name="object-group" />
    </el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'NavBar',
  methods: {
    ...mapMutations('layout', ['OPEN_SIDEBAR', 'CLOSE_SIDEBAR'])
  }
}
</script>

<style lang="scss" scoped>
.nav-bar > button {
  padding-top: 25px;
  margin-left: 0 !important;
}
</style>
