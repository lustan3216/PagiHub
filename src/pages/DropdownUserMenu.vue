<template>
  <div class="flex">
    <el-dropdown>
      <span class="el-dropdown-link">
        <span v-if="isLogin">
          Logout <i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <span v-else>Login</span>
      </span>

      <el-dropdown-menu
        v-if="isLogin"
        slot="dropdown"
      >
        <el-dropdown-item>Profile</el-dropdown-item>
        <el-dropdown-item>Projects</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'DropdownMenu',
  computed: {
    ...mapState('user', ['username', 'coverPhoto']),
    ...mapGetters('user', ['isLogin'])
  },
  methods: {
    ...mapMutations('user', {
      userSet: 'SET',
      userInit: 'INIT'
    })
  }
}
</script>

<style lang="scss" scoped>
  .cover {
    text-align: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100000;
    background-color: rgba(240, 245, 249, 0.85);
  }
  .login {
    position: absolute;
    z-index: 1;
    width: 50vw;
    max-width: 470px;
    height: 340px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background: #f0f5f9;
    opacity: 0.95;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-title{
    font-size: 50px;
    color: $color-black;
    font-weight: lighter;
    letter-spacing: 5px;
  }
  .span {
    margin-left: 15px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .button {
    width: 260px;
    margin: 0;
    border: none;
    color: $color-black;
    background: transparent;
    border-radius: 5px;
    padding: 10px 20px;
  }
  .notice {
    color: $color-black;
    margin-top: 60px;
    font-size: 14px;
  }
  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 5px 2px 2px 5px;
    box-shadow:
      -3px -3px 10px rgba(255, 255, 255, 0.72),
      3px 3px 10px rgba(174, 174, 192, 0.4);
  }
</style>
