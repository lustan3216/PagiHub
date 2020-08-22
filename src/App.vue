<template>
  <div>
    <top-nav v-if="!inDashboard" />

    <router-view :style="{ paddingTop: inDashboard ? '0' : '50px' }" />

    <transition name="fade">
      <component :is="dialog" />
    </transition>

    <portal-target
      v-for="id in selectedComponentIds"
      :name="`QuickFunction${id}`"
      :key="id"
      slim
    />

    <portal-target
      name="TextEditorMenu"
      slim
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
    inDashboard() {
      return this.$route.path.indexOf('/dashboard/') === 0
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
