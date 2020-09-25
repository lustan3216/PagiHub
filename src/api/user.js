import { API } from 'aws-amplify'
import { queryString } from '@/utils/url'

export function getCurrentUser() {
  return API.get('staging', '/users/me', {})
}

export function patchCurrentUser(data) {
  return API.patch('staging', '/users/me', {
    body: data
  })
}

export function usernameCheck({ username }) {
  const _queryString = queryString({ username })
  return API.get('staging', `/username-check?${_queryString}`, {})
}
