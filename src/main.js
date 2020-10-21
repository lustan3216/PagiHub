import 'normalize.css'
import '@/styles/index.scss'
import 'intersection-observer'
import 'whatwg-fetch'
import '@/utils/polyfill'
import '@/amplify'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueShortKey from 'vue-shortkey'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import AppLink from '@/pages/components/AppLink'
import formCreate from '@form-create/element-ui'
import vmMap from '@/utils/vmMap'
import jsonHistory from '@/store/jsonHistory'
import i18n from './i18n'
import ElementUiInstall from './install/elementUi'
ElementUiInstall(Vue)

import RollbarInstall from './install/rollbar'
import HotjarInstall from './install/hotjar'

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  RollbarInstall(Vue)
  HotjarInstall()
}

jsonHistory.tree = store.state.node.nodesMap

import vhCheck from 'vh-check'
vhCheck()

Vue.component('app-link', AppLink)
Vue.use(VueRouter)
Vue.use(formCreate)
Vue.use(PortalVue)
Vue.use(VueShortKey, {
  prevent: ['input', 'textarea', '.ProseMirror', '[contenteditable="true"]']
})

Vue.mixin({
  computed: {
    isProductionMode: () => store.getters['mode/isProductionMode'],
    isPreviewMode: () => store.getters['mode/isPreviewMode'],
    isDraftMode: () => store.getters['mode/isDraftMode'],
    nodesMap: () => store.state.node.nodesMap,
    vmMap: () => vmMap,
    assetHost: () => process.env.VUE_APP_ASSET_HOST
  }
})

Vue.config.errorHandler = (err, vm, info) => {
  if (vm.$rollbar) {
    vm.$rollbar.error(err)
  }
  if (process.env.NODE_ENV === 'development') {
    const { Message } = require('element-ui')
    Message(JSON.stringify(err))
  }

  throw err
}

Vue.prototype.$t = key => i18n[key]
Vue.prototype.$Log = console.log
Vue.prototype.$log = console.log
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')

if (window.Cypress || process.env.NODE_ENV !== 'production') {
  window.store = store
  window.app = app
  Vue.config.devtools = true
}

if (
  process.env.NODE_ENV !== 'production' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__
) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}

export default app
