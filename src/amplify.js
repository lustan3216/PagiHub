import { Amplify, Auth } from 'aws-amplify'
import awsconfig from '@/aws-exports'

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
