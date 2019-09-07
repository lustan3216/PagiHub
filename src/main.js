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

Vue.use(VueShortkey)
Vue.use(ElementUI)
Vue.component('draggable', VueDraggable)
Vue.component('v-icon', Icon)

const bus = new Vue()

Vue.prototype.$log = console.log
Vue.prototype.$bus = bus
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

window.Vue = Vue

const app = new Vue({
  render: h => h(App),
  store
}).$mount('#app')

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
