<template>
  <el-row
    :gutter="15"
    style="height: 60px;"
    align="middle"
    type="flex">
    <el-col :span="1">
      <el-button type="text" @click="OPEN_SIDEBAR('SidebarNodesTree')">
        <v-icon name="layer-group" />
      </el-button>
    </el-col>
    <el-col :span="3">
      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
        type="text"
        @shortkey.native="undo"
        @click="undo"
      >
        <v-icon name="undo" />
      </el-button>

      <el-divider direction="vertical" />

      <el-button
        v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
        type="text"
        @shortkey.native="redo"
        @click="redo"
      >
        <v-icon class="m-l-15" name="redo" />
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapMutations } from 'vuex'
import { isMac } from '../../utils/check'

export default {
  name: 'NavBar',
  methods: {
    ...mapMutations('layout', ['OPEN_SIDEBAR']),
    isMac,
    redo() {},
    undo() {}
  }
}
</script>
