import { API } from 'aws-amplify'

export function getAssets() {
  return API.get('/assets', path, {})
}

export function postAsset(file, name) {
  return API.post('/assets', path, {
    file,
    name
  })
}
