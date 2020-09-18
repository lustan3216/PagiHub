<template>
  <div class="flex">
    <div class="sidebar">
      <el-avatar
        :src="coverPhoto"
        :size="50"
      />

      <h4 class="p">Sign in as</h4>
      <div class="name">
        {{ username || email }}
      </div>

      <el-divider />

      <div class="flex-column">
        <el-button
          type="text"
          icon="el-icon-camera"
          size="medium"
          class="link-li"
          @click="$router.push({ name: 'Designs' })"
        >Design</el-button>
        <el-button
          type="text"
          icon="el-icon-picture-outline-round"
          size="medium"
          class="link-li"
          @click="$router.push({ name: 'Websites' })"
        >Website</el-button>
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-picture-outline-round"-->
        <!--          size="medium"-->
        <!--          class="link-li"-->
        <!--          @click="$router.push({ name: 'Profile' })"-->
        <!--        >Profile</el-button>-->
        <el-button
          type="text"
          icon="el-icon-help"
          size="medium"
          class="link-li"
          @click="$router.push({ name: 'Help' })"
        >Help</el-button>
        <el-button
          type="text"
          icon="el-icon-picture-outline-round"
          size="medium"
          class="link-li"
          @click="logout"
        >Logout</el-button>
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
  methods: {
    ...mapActions('user', ['logout'])
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  padding: 30px;
  flex: 1;
  background-color: #f9f9f9;
}
.link-li {
  text-align: left;
  margin-left: 0;
  font-size: 14px;
  color: $color-black;
  font-weight: normal;
}
.name {
  color: #909399;
  font-size: 14px;
}
.view {
  flex: 6;
  @include calc-vh('height', '100vh');
  overflow: scroll;
}
</style>
