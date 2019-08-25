<template>
  <el-container>
    <el-header class="header">
      <nav-bar />
    </el-header>

    <el-container class="main">
      <transition
        name="fade-left"
        mode="out-in">
        <component :is="$observable.currentSidebar" />
      </transition>

      <el-container>
        <el-main>
          <browser-window>
            <edit-area :node="$observable"/>
          </browser-window>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { snapShot } from './observable/methods'
import NavBar from './components/Layout/NavBar'
import EditArea from './components/EditArea'
import RenderNode from './components/RenderNode'
import SidebarTemplates from './components/Layout/SidebarTemplates'
import SidebarSettings from './components/Layout/SidebarSettings'
import BrowserWindow from './components/BrowserWindow'
import importTemplates from './mixins/importTemplates'

export default {
  name: 'App',
  components: {
    EditArea,
    NavBar,
    SidebarTemplates,
    SidebarSettings,
    BrowserWindow,
    RenderNode
  },
  mixins: [importTemplates],
  methods: {
    setContent(value) {
      this.$observable.content = value
      snapShot()
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #eff1f2;
  box-shadow: 0 2px 5px 0 rgba(32, 48, 60, 0.05);
  font-size: 14px;
  position: relative;
}

.main {
  @include calc-vh(min-height, '100vh - 60px');
}

.edit-area {
  padding-top: 35px;
  @include calc-vh(min-height, '100vh - 135px');
}
</style>
