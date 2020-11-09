<template>
  <div>
    <top-nav v-if="needNavBar" />

    <router-view :style="{ paddingTop: needNavBar ? '50px' : '0' }" />

    <portal-target
      name="App"
      multiple
    />

    <facebook-chat />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    FacebookChat: () => import('@/pages/FacebookChat')
  },
  computed: {
    needNavBar() {
      return !this.$route.meta.noNavbar && !this.isPreviewMode
    }
  },
  created() {
    if (!this.$route.meta.noNeedLogin) {
      this.getCurrentLocalUser()
    }
  },
  methods: {
    ...mapActions('user', ['getCurrentLocalUser'])
  }
}
</script>

<style lang="scss"></style>
