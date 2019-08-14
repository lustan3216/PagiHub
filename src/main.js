import vhCheck from 'vh-check'
vhCheck()

import './styles/index.scss'

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueDraggable from 'vuedraggable'
import observable from './observable'
import Wrapper from './components/Wrapper'
window.Vue = Vue
Vue.mixin({
  props: ['observableNode']
})
Vue.use(ElementUI)
Vue.component('draggable', VueDraggable)
Vue.component('wrapper', Wrapper)

Vue.prototype.$observable = observable
Vue.config.productionTip = false
window.$observable = observable
Vue.config.devtools = process.env.NODE_ENV === 'development'

const app = new Vue({
  render: h => h(App)
}).$mount('#app')

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
