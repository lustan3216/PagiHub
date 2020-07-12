<template>
  <div class="cover">
    <div v-if="isLogin" class="logout">
      <button @click="logout">
        logout
      </button>
    </div>
    <div v-else class="login shadow-2">
      <el-button class="close" type="text" icon="el-icon-close"/>
      <h1 class="login-title">LOGIN</h1>
      <button
        class="button flex-center pointer m-b-15"
        @click="login('Facebook')"
      >
        <img svg-inline class="icon" src="svgs/facebook.svg" />
        <span class="span">Login with Facebook</span>
      </button>

      <button
        class="button flex-center pointer"
        @click="login('Google')"
      >
        <img svg-inline class="icon" src="svgs/google.svg" />
        <span class="span">Login with Google</span>
      </button>

      <span class="notice">點擊「註冊」即表示你同意我們的使用條款及私隱政策。</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Auth, Hub } from 'aws-amplify'

export default {
  name: 'DialogAuth',
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
    },
    async logout() {
      try {
        await Auth.signOut()
      } catch (error) {
        console.log('error signing out: ', error)
      }
    }
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
    background-color: rgba(226, 228, 230, 0.55);
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
    background: #E2E4E6;
    opacity: 0.95;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-title{
    font-size: 50px;
    color: #323233;
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
    background: transparent;
    border-radius: 5px;
    border: 1px solid #d8d5d5;
    font-weight: lighter;
    padding: 10px 20px;
    transition: box-shadow 0.4s ease;
  }
  .button:hover{
    box-shadow:
      -3px -3px 10px rgba(255,255,255,0.32),
      3px 3px 10px rgba(174, 174, 192, 0.3);
  }
  .notice {
    margin-top: 60px;
    font-size: 14px;
  }
  .close {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 20px;
  }
</style>
