import { Amplify, Auth } from 'aws-amplify'
import awsconfig from '@/aws-exports'

awsconfig.oauth.redirectSignIn = process.env.VUE_APP_REDIRECT_SIGN_IN
awsconfig.oauth.redirectSignOut = process.env.VUE_APP_REDIRECT_SIGN_OUT

Amplify.configure({
  ...awsconfig,
  API: {
    endpoints: [
      {
        name: 'jwt',
        endpoint: process.env.VUE_APP_API_ENDPOINT,
        custom_header: async() => {
          const session = await Auth.currentSession()
          return {
            Authorization: `${session.getAccessToken().getJwtToken()}`
          }
        }
      }
    ]
  }
})
