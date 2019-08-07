import vhCheck from 'vh-check'
vhCheck()

import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import VueDraggable from 'vuedraggable'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import store from './store'

Vue.use(ElementUI)
Vue.component('draggable', VueDraggable)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
