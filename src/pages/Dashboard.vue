<template>
  <div class="flex">
    <div class="sidebar gradient-gray">
      <el-avatar
        :src="coverPhoto"
        :size="50"
      />

      <h4 class="p">Sign in as</h4>

      <div class="name" v-if="username">
        {{ username }}
      </div>

      <div class="name m-t-10">
        {{ email }}
      </div>

      <el-divider />

      <div class="flex-column">
        <router-link
          :to="{ name: 'Projects' }"
          class="link-li"
        >
          <i class="el-icon-picture-outline-round" /> Projects
        </router-link>

        <router-link
          :to="{ name: 'Help' }"
          class="link-li"
        >
          <i class="el-icon-help" /> Help
        </router-link>

        <router-link
          to="/"
          class="link-li"
          @click.native="logout"
        >
          <i class="el-icon-switch-button" /> Logout
        </router-link>
      </div>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script>
import { Avatar } from 'element-ui'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'DashboardVue',
  components: {
    ElAvatar: Avatar
  },
  computed: {
    ...mapState('user', ['email', 'username', 'coverPhoto']),
    ...mapGetters('user', ['isLogin'])
  },
  created() {
    this.$router.push({ name: 'Projects' })
  },
  methods: {
    ...mapActions('user', ['logout'])
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
  @include calc-vh('height', '100vh');
  overflow: scroll;
}
</style>
