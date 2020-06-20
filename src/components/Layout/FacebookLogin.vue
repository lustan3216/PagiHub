<template>
  <div>
    <button v-if="isLogin" @click="logout">
      logout
    </button>
    <template v-else>
      <button @click="login('Facebook')">
        Facebook
      </button>

      <button @click="login('Google')">
        Google
      </button>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Amplify, { Auth, Hub, API } from 'aws-amplify'
import awsconfig from '@/aws-exports'

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'staging',
        endpoint: 'https://staging-api.lots.design',
        custom_header: async() => {
          const session = await Auth.currentSession()
          return { Authorization: `${session.getIdToken().getJwtToken()}` }
        }
      }
    ]
  }
});
Amplify.configure(awsconfig)

export default {
  data() {
    return {
      isLogin: false,
      user: null
    }
  },
  created() {
    this.getCurrentUser()

    Hub.listen('auth', ({ payload: { event, data }}) => {
      switch (event) {
        case 'signIn':
          this.isLogin = true
          this.userSet({ id: data.username })
          break
        case 'signOut':
          this.isLogin = false
          this.userInit()
          break
      }
    })
  },
  methods: {
    ...mapMutations('user', {
      userSet: 'SET',
      userInit: 'INIT'
    }),
    login(provider) {
      Auth.federatedSignIn({ provider })
    },
    async getCurrentUser() {
      const apiName = 'staging'
      const path = '/projects'
      const a = await API.get(apiName, path, {})
      console.log(a)
      this.isLogin = true
      // this.userSet({ id: user.username })
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
