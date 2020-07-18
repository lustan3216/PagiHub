import { API } from 'aws-amplify'
import { isUndefined } from '@/utils/tool'

export function getTags({ query, size }) {
  const params = {
    query,
    size
  }
  const paramsString = Object.keys(params).reduce((array, key) => {
    if (!isUndefined(params[key])) {
      array.push(`${key}=${params[key]}`)
    }

    return array
  }, []).join('&')

  return API.get('staging', `/tags?${paramsString}`, {})
}