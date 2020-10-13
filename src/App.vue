<template>
  <div>
    <top-nav v-if="needNavBar" />

    <router-view :style="{ paddingTop: needNavBar ? '50px' : '0' }" />

    <dialog-component-tabs
      :visible="Boolean(beingAddedComponentId)"
      @uploading="uploading = true"
      @uploaded="uploading = false"
    />

    <portal-target
      v-for="id in selectedComponentIds"
      :name="`App-${id}`"
      :key="id"
      slim
    />

    <portal-target
      name="App"
      multiple
    />

    <div id="fb-root" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    DialogComponentTabs: () =>
      import('@/components/ExampleAddPanel/DialogComponentTabs')
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('app', ['beingAddedComponentId']),
    ...mapGetters('user', ['isLogin']),
    inDashboard() {
      return this.$route.path.indexOf('/dashboard') === 0
    },
    needNavBar() {
      return !this.inDashboard && !this.isPreviewMode && !this.isProductionMode
    }
  },
  created() {
    this.getCurrentUser()
  },
  methods: {
    ...mapActions('user', ['getCurrentUser'])
  }
}
</script>

<style lang="scss"></style>
