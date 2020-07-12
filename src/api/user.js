import { API } from "aws-amplify";

export function getCurrentUser() {
  return API.get('staging', '/users/me', {})
}

export function patchCurrentUser(username) {
  return API.patch('staging', '/users/me', {
    username
  })
}
