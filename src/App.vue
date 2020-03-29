<template>
  <div class="flex">
    <main class="w-100">
      <nav-bar />

      <panel-production v-if="isProductionMode" />
      <panel-editable v-else />

    </main>

    <sidebar-right v-if="isEditableMode" />
  </div>
</template>

<script>
import NavBar from './components/Layout/NavBar'
import PanelProduction from './components/Layout/PanelProduction'
import PanelEditable from './components/Layout/PanelEditable'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar,
    SidebarRight: () => import('./components/Layout/SidebarRight'),
    PanelProduction,
    PanelEditable
  },
  created() {
    this.getRootNode()
  },
  methods: {
    ...mapActions('nodes', ['getRootNode'])
  }
}
</script>
