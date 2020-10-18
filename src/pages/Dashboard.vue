<template>
  <div class="flex">
    <div class="sidebar gradient-gray">
      <el-avatar
        :src="coverPhoto"
        :size="50"
      />

      <h4 class="p m-b-10">Sign in as</h4>

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
          :to="{ name: 'Help' }"
          class="link-li"
        >
          <i class="el-icon-help" /> Help
        </app-link>

        <app-link
          to="https://github.com/LotsDesign/issues/issues/new?assignees=&labels=&template=bug_report.md&title="
          class="link-li"
        >
          <i class="el-icon-warning-outline" /> Bug report
        </app-link>

        <app-link
          to="https://github.com/LotsDesign/issues/issues/new?assignees=&labels=&template=feature_request.md&title="
          class="link-li"
        >
          <i class="el-icon-coffee-cup" /> Feature request
        </app-link>

        <app-link
          to="https://github.com/LotsDesign/issues/issues/new"
          class="link-li"
        >
          <i class="el-icon-phone-outline" /> Contact
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
