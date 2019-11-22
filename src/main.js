import './utils/polyfill'
import vhCheck from 'vh-check'
vhCheck()

import './styles/index.scss'

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueDraggable from 'vuedraggable'
import store from './store'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import VueShortkey from 'vue-shortkey'
import PortalVue from 'portal-vue'

Vue.use(PortalVue)
Vue.use(VueShortkey)
Vue.use(ElementUI)
Vue.component('draggable', VueDraggable)
Vue.component('v-icon', Icon)

const bus = new Vue()

Vue.prototype.$log = console.log
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

window.Vue = Vue

Vue.mixin({
  data() {
    const vals = this.$options.rules
    if (vals) {
      this.rules = vals
    }
    return {}
  },
  beforeCreate() {
    // const options = this.$options
    // const vals = options.rules
    // if (!vals) return
    // if (!options.computed) options.computed = {}
    // if (options.computed.$v) return
    // options.computed.$v = function() {
    //   return this._vuelidate ? this._vuelidate.refs.$v.proxy : null
    // }
  },
  beforeDestroy() {
    // if (this._vuelidate) {
    //   this._vuelidate.$destroy()
    //   this._vuelidate = null
    // }
  }
})

const app = new Vue({
  render: h => h(App),
  store
}).$mount('#app')

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor

export { bus }
