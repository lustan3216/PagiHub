import { Amplify, Auth } from 'aws-amplify'
import awsconfig from '@/aws-exports'

let url
if (process.env.NODE_ENV === 'production') {
  url = 'https://staging.lots.design/'
} else {
  url = 'https://localhost:8080/'
}

awsconfig.oauth.redirectSignIn = url
awsconfig.oauth.redirectSignOut = url

Amplify.configure({
  ...awsconfig,
  API: {
    endpoints: [
      {
        name: 'staging',
        endpoint: 'https://staging-api.lots.design',
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
