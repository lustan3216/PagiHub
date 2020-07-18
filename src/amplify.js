import { Amplify, Auth } from 'aws-amplify'
import awsconfig from '@/aws-exports'

Amplify.configure({
  ...awsconfig,
  API: {
    endpoints: [
      {
        name: 'dev',
        endpoint: 'http://127.0.0.1:3000',
        custom_header: async() => {
          const session = await Auth.currentSession()
          return {
            Authorization: `${session.getAccessToken().getJwtToken()}`
          }
        }
      },
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
