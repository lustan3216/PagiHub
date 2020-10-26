<template>
  <div>
    <top-nav v-if="needNavBar" />

    <router-view :style="{ paddingTop: needNavBar ? '50px' : '0' }" />

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

    <dialog-component-tabs
      v-if="isDraftMode"
      v-show="beingAddedComponentId"
      :visible="Boolean(beingAddedComponentId)"
    />

    <facebook-chat />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    FacebookChat: () => import('@/pages/FacebookChat'),
    DialogComponentTabs: () =>
      import('@/components/ComponentAdd/DialogComponentTabs')
  },
  data() {
    return {
      uploading: false
    }
  },
  computed: {
    ...mapState('app', ['selectedComponentIds']),
    ...mapGetters('user', ['isLogin']),
    ...mapState('app', ['beingAddedComponentId']),
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
