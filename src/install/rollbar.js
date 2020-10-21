import Rollbar from 'rollbar'

export default function(Vue) {
  const rollbar = new Rollbar({
    accessToken: process.env.VUE_APP_ROLLBAR_KEY,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
    source_map_enabled: process.env.NODE_ENV === 'staging',
    environment: location.host,
    payload: {
      environment: process.env.NODE_ENV
    }
  })

  Vue.prototype.$rollbar = rollbar
}

