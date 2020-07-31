<template>
  <div class="sidebar-left flex-column">
    <panel-project
      v-if="isLogin"
      class="flex1"
    />
    <panel-nodes class="flex2" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelNodes from '../Setup/PanelNodes'
import PanelProject from '../Setup/PanelProject'

export default {
  name: 'SidebarLeft',
  components: {
    PanelNodes,
    PanelProject
  },
  computed: {
    ...mapGetters('user', ['isLogin'])
  }
}
</script>

<style scoped lang="scss">
.sidebar-left {
  width: 260px;
  padding: 10px;
  background-color: white;
  border-right: 1px solid $color-grey;
}
</style>
