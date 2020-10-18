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
      v-if="isDraftMode && (beingAddedComponentId || uploading)"
      :visible="Boolean(beingAddedComponentId)"
      @uploading="uploading = true"
      @uploaded="uploading = false"
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
    ...mapGetters('user', ['isLogin']),
    ...mapState('app', ['beingAddedComponentId']),
    needNavBar() {
      return !this.$route.meta.noNavbar && !this.isPreviewMode
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
