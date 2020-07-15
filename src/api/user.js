import { API } from 'aws-amplify'

export function getCurrentUser() {
  return API.get('staging', '/users/me', {})
}

export function patchCurrentUser(data) {
  return API.patch('staging', '/users/me', {
    body: data
  })
}
