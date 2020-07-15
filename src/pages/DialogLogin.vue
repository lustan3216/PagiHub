<template>
  <dialog-shadow>
    <h1 class="login-title">LOGIN</h1>
    <el-button
      type="text"
      class="button flex-center m-b-15"
      @click="login('Facebook')"
    >
      <div class="vertical-center">
        <img
          svg-inline
          class="icon"
          src="svgs/facebook.svg"
        >
        <span class="span">Login with Facebook</span>
      </div>
    </el-button>

    <el-button
      type="text"
      class="button flex-center"
      @click="login('Google')"
    >
      <div class="vertical-center">
        <img
          svg-inline
          class="icon"
          src="svgs/google.svg"
        >
        <span class="span">Login with Google</span>
      </div>
    </el-button>

    <span class="notice">After signed, which means you have agreed ours "Using Policy" and "Private Policy".</span>
  </dialog-shadow>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Auth, Hub } from 'aws-amplify'
import DialogShadow from './components/DialogShadow'

export default {
  name: 'DialogLogin',
  components: {
    DialogShadow
  },
  computed: {
    ...mapGetters('user', ['isLogin'])
  },
  created() {
    Hub.listen('auth', ({ payload: { event, data }}) => {
      switch (event) {
        case 'signIn':
          this.getCurrentUser()
          break
        case 'signOut':
          this.userInit()
          break
      }
    })
  },
  methods: {
    ...mapActions('user', ['getCurrentUser']),
    ...mapMutations('user', {
      userSet: 'SET',
      userInit: 'INIT'
    }),
    login(provider) {
      Auth.federatedSignIn({ provider })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    color: $color-black;
    padding: 10px 20px;
  }
  .notice {
    color: $color-black;
    margin-top: 60px;
    font-size: 14px;
  }
</style>
