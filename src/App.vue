<template>
  <div>
    <top-nav/>

    <div class="view">
      <router-view />
    </div>

    <transition name="fade">
      <component :is="dialog" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    DialogLogin: () => import('@/pages/DialogLogin')
  },
  computed: {
    ...mapState('app', ['dialog'])
  },
  created() {
    this.getCurrentUser()
  },
  methods: {
    ...mapActions('user', ['getCurrentUser']),
  }
}
</script>

<style lang="scss">
.view {
  overflow: scroll;
  @include calc-vh('height', '100vh - 40px');
}
</style>
