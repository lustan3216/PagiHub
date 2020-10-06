import axios from 'axios'
let API = {}

if (process.env.NODE_ENV === 'test') {
  API.get = (_, url, data) => axios.get(url, data)

  API.post = (_, url, data = {}) => axios.post(url, data.body)

  API.del = (_, url, data) => axios.delete(url)

  API.patch = (_, url, data = {}) => axios.patch(url, data.body)
}
else {
  API = require('aws-amplify').API
}

export { API }
