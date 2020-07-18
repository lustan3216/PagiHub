<template>
  <dialog-shadow :can-close="false">
    <h1 class="login-title">Choose a username</h1>

    <el-input
      v-model="input"
      placeholder="Enter your username"
    >
      <el-button
        slot="append"
        icon="el-icon-s-promotion"
      />
    </el-input>

    <span class="notice">After signed, which means you have agreed ours "Using Policy" and "Private Policy".</span>
  </dialog-shadow>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Auth, Hub } from 'aws-amplify'
import DialogShadow from './components/DialogCreateUsername'

export default {
  name: 'DialogLogin',
  components: {
    DialogShadow
  },
  data() {
    return {
      input: null
    }
  },
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
</style>
