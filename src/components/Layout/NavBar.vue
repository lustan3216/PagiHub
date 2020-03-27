<template>
  <el-header height="40px" class="white-back">
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
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
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
  </el-header>
</template>

<script>
import { mapMutations } from 'vuex'
import { isMac } from '../../utils/check'
export default {
  name: 'NavBar',
  methods: {
    isMac,
    redo() {},
    undo() {}
  },
  mounted() {
    // window.addEventListener('wheel', function (e) {
    //   console.log(zoom, device, e)
    //   var zoom = detectZoom.zoom();
    //   var device = detectZoom.device();
    //
    // })
  }
}
</script>
