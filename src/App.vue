<template>
  <div>
    <top-nav v-if="hasNavBar" />

    <router-view :style="{ paddingTop: hasNavBar ? '50px' : '0' }" />

    <transition name="fade">
      <component :is="dialog" />
    </transition>

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
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    DialogLogin: () => import('@/pages/components/DialogLogin'),
    DialogComponentTabs: () =>
      import('@/components/ComponentAddPanel/DialogComponentTabs')
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('app', ['dialog']),
    ...mapGetters('user', ['isLogin']),
    inDashboard() {
      return this.$route.path.indexOf('/dashboard/') === 0
    },
    hasNavBar() {
      return !this.inDashboard && !this.isPreviewMode
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
