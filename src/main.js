import 'normalize.css'
import 'element-ui/packages/theme-chalk/src/index.scss'
import './utils/polyfill'
import vhCheck from 'vh-check'
vhCheck()

import './styles/vender.scss'
import './styles/index.scss'
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueDraggable from 'vuedraggable'
import store from './store'
import VueShortkey from 'vue-shortkey'
import PortalVue from 'portal-vue'
import Unicon from 'vue-unicons'

import {
  uniPlus,
  uniRedo,
  uniSearchPlus,
  uniSearchMinus,
  uniLayerGroup,
  uniBookMedical,
  uniObjectGroup,
  uniPrevious,
  uniLeftArrowToLeft,
  uniCog
} from 'vue-unicons/src/icons'
Unicon.add([
  uniPlus,
  uniRedo,
  uniSearchPlus,
  uniSearchMinus,
  uniLayerGroup,
  uniBookMedical,
  uniObjectGroup,
  uniPrevious,
  uniLeftArrowToLeft,
  uniCog
])

Vue.use(Unicon)
Vue.use(PortalVue)
Vue.use(VueShortkey)
Vue.use(ElementUI)
Vue.component('draggable', VueDraggable)

const bus = new Vue()

Vue.prototype.$log = console.log
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

window.Vue = Vue

const app = new Vue({
  render: h => h(App),
  store
}).$mount('#app')

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor

export { bus }
