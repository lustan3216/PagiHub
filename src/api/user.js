import { API } from './request'
import { queryString } from '@/utils/url'

export function patchCurrentUser(data) {
  return API.patch('jwt', '/users/me', {
    body: data
  })
}

export function usernameCheck({ username }) {
  const _queryString = queryString({ username })
  return API.get('jwt', `/username-check?${_queryString}`, {})
}
