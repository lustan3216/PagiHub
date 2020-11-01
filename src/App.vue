<template>
  <div>
    <top-nav v-if="needNavBar" />

    <router-view :style="{ paddingTop: needNavBar ? '50px' : '0' }" />

    <portal-target
      name="App"
      multiple
    />

    <dialog-image-tabs
      v-if="isDraftMode"
      :visible="isImageDialogOpen"
    />

    <facebook-chat />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    FacebookChat: () => import('@/pages/FacebookChat'),
    DialogImageTabs: () => import('@/components/ComponentAdd/DialogImageTabs')
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapState('asset', ['isImageDialogOpen']),
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
