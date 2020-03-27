<template>
  <el-container>
    <splitpanes class="default-theme">
      <pane size="20">
        <splitpanes class="default-theme" horizontal style="height: 100vh">
          <pane>
            <tree-nodes />
          </pane>
    
          <pane>
            <tree-components />
          </pane>
        </splitpanes>
      </pane>
      
      <pane>
        <nav-bar/>
        
        <el-main class="main">
          <board-root class="edit-area" />
        </el-main>
        
      </pane>
    </splitpanes>
    
    <sidebar-right />
  </el-container>
</template>

<script>
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import NavBar from './components/Layout/NavBar'
import TreeNodes from './components/Layout/TreeNodes'
import TreeComponents from './components/Layout/TreeComponents'
import SidebarRight from './components/Layout/SidebarRight'
import EditArea from './components/Templates/AreaDraggable'
import BoardRoot from './components/Layout/BoardRoot'

export default {
  name: 'App',
  components: {
    EditArea,
    NavBar,
    TreeNodes,
    SidebarRight,
    TreeComponents,
    BoardRoot,
    Splitpanes,
    Pane
  }
}
</script>

<style lang="scss" scoped>
.vertical-header {
  background-color: #fff;
  border-bottom: 1px solid #eff1f2;
  box-shadow: 0 2px 5px 0 rgba(32, 48, 60, 0.05);
  font-size: 14px;
  position: relative;
}

.main {
  width: 100%;
  @include calc-vh(height, '100vh - 40px');
  overflow: scroll;
}
</style>
