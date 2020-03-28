<template>
  <nav>
    <!--publish-->
    <el-button type="text" icon="el-icon-upload" />

    <!--css code-->
    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
      type="text"
      icon="el-icon-tickets"
    />

    <!--preview-->
    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
      type="text"
      icon="el-icon-data-analysis"
    />

    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'z']"
      type="text"
      icon="el-icon-refresh-left"
      @shortkey.native="undo"
      @click="undo"
    />

    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
      type="text"
      icon="el-icon-refresh-right"
      @shortkey.native="redo"
      @click="redo"
    />

    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
      type="text"
      icon="el-icon-zoom-in"
      @shortkey.native="redo"
      @click="redo"
    />

    <el-button
      v-shortkey="[isMac ? 'meta' : 'ctrl', 'shift', 'z']"
      type="text"
      icon="el-icon-zoom-out"
      @shortkey.native="redo"
      @click="redo"
    />

    <el-dropdown>
      <span class="el-dropdown-link">
        下拉菜单
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>Custom</el-dropdown-item>
        <el-dropdown-item>Computer 1920px</el-dropdown-item>
        <el-dropdown-item>Computer 1200px</el-dropdown-item>
        <el-dropdown-item>Computer 996px</el-dropdown-item>
        <el-dropdown-item>Tablet 768px</el-dropdown-item>
        <el-dropdown-item>Mobile 320px</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <span>{{ scalePrecent }}</span>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import { isMac } from '../../utils/check'
export default {
  name: 'NavBar',
  computed: {
    scalePrecent() {
      return Math.ceil(+this.scaleRatio * 100)
    },
    ...mapState('app', ['scaleRatio'])
  },
  methods: {
    isMac,
    redo() {},
    undo() {}
  }
}
</script>

<style scoped lang="scss">
nav {
  text-align: center;
  height: 35px;
  padding: 5px 20px;
}
</style>
