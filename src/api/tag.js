import { API } from 'aws-amplify'

export function getTags(text, size) {
  return API.get('/tags', path, {
    text,
    size
  })
}

export function postTag(label) {
  return API.get('/tags', path, {
    label
  })
}
