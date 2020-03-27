<template>
  <splitpanes class="default-theme " horizontal style="height: 100vh">
    <pane>
      <tree-nodes />
    </pane>
    
    <pane>
      <tree-components />
    </pane>
  </splitpanes>
</template>

<script>
  import { Splitpanes, Pane } from 'splitpanes'
  import TreeComponents from './TreeComponents'
  import TreeNodes from './TreeNodes'
export default {
  name: 'SidebarLeft',
  components: {
    TreeNodes,
    TreeComponents,
    Splitpanes,
    Pane
  }
}
</script>

<style scoped lang="scss"></style>
