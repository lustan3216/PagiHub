import { API, Auth } from 'aws-amplify'
import axios from 'axios'
import store from '@/store'

export function getAssets(projectId) {
  return API.get('staging', `/projects/${projectId}/asset`, {})
}

export function postAsset(fieldName, file, metadata, load, error, progress, abort) {
  // fieldName is the name of the input field
  // file is the actual file object to send
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const formData = new FormData()
  const pathArray = file._relativePath.split('/')

  pathArray.pop()
  formData.append('file', file)
  formData.append('label', file.name)
  formData.append('path', pathArray.join('/'))

  const projectId = store.state.component.editingProjectId
  const url = `https://staging-api.lots.design/projects/${projectId}/asset`

  Auth.currentSession()
    .then(session => {
      return axios.post(url, formData, {
        cancelToken: source.token,
        onUploadProgress(e) {
          progress(e.lengthComputable, e.loaded, e.total)
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${session.getAccessToken().getJwtToken()}`
        }
      })
    })
    .then(({ data }) => {
      store.commit('asset/ADD_IMAGE', data.data)
      load(data)
    })
    .catch(e => error(e))

  return {
    abort: () => {
      source.cancel()
      abort()
    }
  }
}

export function deleteAsset(id) {
  return API.del('staging', `/assets/${id}`, {})
}
