<template>
  <div class="flex">
    <div class="sidebar gradient-gray">
      <el-avatar
        :src="coverPhoto"
        :size="50"
      />

      <h4 class="p m-b-10 m-t-10">Sign in as</h4>

      <div
        v-if="username"
        class="name"
      >
        {{ username }}
      </div>

      <div
        class="name"
        style="margin-top: 30px;"
      >
        {{ email }}
      </div>

      <el-divider />

      <div class="flex-column">
        <app-link
          :to="{ name: 'Projects' }"
          class="link-li"
        >
          <i class="el-icon-picture-outline-round" /> Projects
        </app-link>

        <app-link
          to="/"
          class="link-li"
          @click.native="logout"
        >
          <i class="el-icon-switch-button" /> Logout
        </app-link>
      </div>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
import { Avatar } from 'element-ui'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'DashboardVue',
  components: {
    ElAvatar: Avatar
  },
  computed: {
    ...mapState('user', ['email', 'username', 'coverPhoto']),
    ...mapGetters('user', ['isLogin'])
  },
  beforeMount() {
    this.$router.push({ name: 'Projects' })
  },
  mounted() {
    this.PROJECT_INIT()
    this.APP_RESET()
  },
  methods: {
    ...mapActions('user', ['logout']),
    ...mapMutations('node', ['PROJECT_INIT']),
    ...mapMutations('app', ['APP_RESET'])
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  padding: 30px;
  flex: 1;
}
.link-li {
  text-align: left;
  margin-left: 0;
  font-size: 14px;
  color: $color-black;
  font-weight: normal;
  margin-bottom: 20px;
}
.name {
  color: #909399;
  font-size: 14px;
}
.view {
  padding: 15px;
  flex: 6;
  box-sizing: border-box;
  @include calc-vh('height', '100vh');
  overflow: scroll;
}
</style>
