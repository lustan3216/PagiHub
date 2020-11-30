<template>
  <div>
    <top-nav v-if="needNavBar && mounted" />

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
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    needNavBar() {
      return !this.isPreviewMode && !this.$route.meta.noNavbar
    }
  },
  created() {
    if (!this.$route.meta.noNeedLogin) {
      this.getCurrentLocalUser()
    }
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    ...mapActions('user', ['getCurrentLocalUser'])
  }
}
</script>

<style lang="scss"></style>
