<template>
  <div>
    <top-nav />

    <router-view />

    <transition name="fade">
      <component :is="dialog" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TopNav from '@/pages/TopNav'

export default {
  name: 'App',
  components: {
    TopNav,
    DialogLogin: () => import('@/pages/components/DialogLogin')
  },
  computed: {
    ...mapState('app', ['dialog'])
  },
  created() {
    this.getCurrentUser()
  },
  methods: {
    ...mapActions('user', ['getCurrentUser'])
  }
}
</script>

<style lang="scss">

</style>
