import { API, Auth } from 'aws-amplify'
import axios from 'axios'
import store from '@/store'
import Compressor from 'compressorjs'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

export function getAssets({ projectId }) {
  return API.get('jwt', `/projects/${projectId}/asset`, {})
}

export function postAsset(
  fieldName,
  file,
  metadata,
  load,
  error,
  progress,
  abort
) {
  // fieldName is the name of the input field
  // file is the actual file object to send

  new Compressor(file, {
    quality: 0.8,
    success(result) {
      const formData = new FormData()
      const pathArray = file._relativePath.split('/')

      pathArray.pop()
      formData.append('file', result, file.name)
      formData.append('label', file.name)
      formData.append('path', pathArray.join('/'))

      const projectId = store.state.node.editingProjectId
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
    },
    error(e) {
      error(e)
      throw e
    }
  })

  return {
    abort: () => {
      source.cancel()
      abort()
    }
  }
}

export function deleteAsset({ id }) {
  return API.del('jwt', `/assets/${id}`, {})
}
