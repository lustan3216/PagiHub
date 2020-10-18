import axios from 'axios'
import { API } from 'aws-amplify'
const isTest = process.env.NODE_ENV === 'test'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT
})

export default {
  get: (type, url, data) =>
    isTest || type === 'axios'
      ? instance.get(url, data)
      : API.get(type, url, data),

  post: (type, url, data) =>
    isTest || type === 'axios'
      ? instance.post(url, data.body)
      : API.post(type, url, data),

  del: (type, url, data) =>
    isTest || type === 'axios'
      ? instance.delete(url)
      : API.del(type, url, data),

  patch: (type, url, data) =>
    isTest || type === 'axios'
      ? instance.patch(url, data.body)
      : API.patch(type, url, data)
}
