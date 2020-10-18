<template>
  <div class="wrapper">
    <h1
      class="login-title"
      style="margin-bottom: 70px;"
    >SIGN IN</h1>

    <div
      class="vertical-center button"
      style="background-color: #405993; margin-bottom: 20px;"
      @click="login('Facebook')"
    >
      <span
        class="icon"
        style="border: 1px solid #405993"
      >
        <img
          svg-inline
          class="icon"
          src="svgs/facebook.svg"
          style="width: 12px;"
        >
      </span>
      <div class="flex1 text-center">
        <span class="span">Sign in with Facebook</span>
      </div>
    </div>

    <div
      class="button google vertical-center"
      style="background-color: #5185EC"
      @click="login('Google')"
    >
      <span
        class="icon"
        style="border: 1px solid #5185EC"
      >
        <img
          svg-inline
          class="icon"
          src="svgs/google.svg"
          style="width: 20px;"
        >
      </span>
      <div class="flex1 text-center">
        <span class="span">Sign in with Google</span>
      </div>
    </div>

    <span
      class="notice"
    >* By signing up, you agree to our
      <router-link :to="{ name: 'Terms' }">Terms of Use</router-link> and to
      receive LotsDesign emails & updates and acknowledge that you read our
    <router-link :to="{ name: 'Privacy' }">Privacy Policy</router-link>.</span>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Auth } from 'aws-amplify'

export default {
  name: 'Login',
  computed: {
    ...mapGetters('user', ['isLogin'])
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
.wrapper {
  transform: translate(-50%, -50%);
  padding: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}
.login-title {
  font-size: 50px;
  color: $color-black;
  letter-spacing: 5px;
}
.span {
  font-size: 14px;
  letter-spacing: 1px;
  text-align: center;
}
.button {
  cursor: pointer;
  width: 300px;
  margin: 0;
  color: white;
  border-radius: 2px;
  overflow: hidden;
}
.notice {
  color: #858f96;
  margin-top: 60px;
  font-size: 14px;
  line-height: 28px;
  max-width: 500px;
  display: block;
}
.icon {
  width: 46px;
  height: 46px;
  display: inline-block;
  background-color: white;
  text-align: center;
}
a {
  text-decoration: none;
}
</style>
