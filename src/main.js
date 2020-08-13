import 'normalize.css'
import '@/styles/index.scss'
import '@/utils/polyfill'
import '@/amplify'
import 'intersection-observer'
import 'whatwg-fetch'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueShortKey from 'vue-shortkey'
import VueRouter from 'vue-router'
import PortalVue from 'portal-vue'
import formCreate from '@form-create/element-ui'
import vmMap from '@/utils/vmMap'
import jsonHistory from '@/store/jsonHistory'
jsonHistory.tree = store.state.component.componentsMap

import vhCheck from 'vh-check'
vhCheck()

Vue.use(VueRouter)
Vue.use(formCreate)
Vue.use(PortalVue)
Vue.use(VueShortKey, { prevent: ['input', 'textarea', '.ProseMirror'] })
if (process.env.NODE_ENV !== 'production') {
  window.store = store
}

Vue.mixin({
  computed: {
    isProductionMode: () => store.getters['mode/isProductionMode'],
    isPreviewMode: () => store.getters['mode/isPreviewMode'],
    isDraftMode: () => store.getters['mode/isDraftMode'],
    componentsMap: () => store.state.component.componentsMap,
    vmMap: () => vmMap
  }
})

import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Radio,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Tabs,
  TabPane,
  Row,
  Col,
  ColorPicker,
  Loading,
  Form,
  FormItem
} from 'element-ui'
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.prototype.$loading = Loading.service

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)
Vue.use(ColorPicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading.directive)

// eslint-disable-next-line
import i18n from './i18n'

import WebFont from 'webfontloader';
Vue.prototype.$t = key => i18n[key]
Vue.prototype.$Log = console.log
Vue.prototype.$log = console.log
Vue.prototype.$bus = new Vue()
Vue.prototype.$dialog = {
  close: () => store.commit('app/DIALOG_CLOSE'),
  open: name => store.commit('app/DIALOG_OPEN', name)
}

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

const app = new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')

if (
  process.env.NODE_ENV !== 'production' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__
) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}

export default app
