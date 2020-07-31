<template>
  <div class="flex">
    <div style="flex: 1;">
      <img
        :src="coverPhoto"
        style=""
        class="circle"
      >

      <h4>Sign in as</h4>
      <span>
        {{ username || id.replace('_', ' ') }}
      </span>

      <hr >

      <ul>
        <li @click="$router.push({ name: 'Projects' })">Projects</li>
        <li @click="$router.push({ name: 'Profile' })">Profile</li>
        <li @click="logout">Logout</li>
      </ul>
    </div>
    <div style="flex: 5;">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'DashboardVue',
  computed: {
    ...mapState('user', ['id', 'username', 'coverPhoto']),
    ...mapGetters('user', ['isLogin'])
  },
  methods: {
    ...mapActions('user', ['logout'])
  }
}
</script>

<style scoped lang="scss"></style>
