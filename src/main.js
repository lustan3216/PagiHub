import '@babel/polyfill'
import 'normalize.css'
import './styles/vender.scss'
import './styles/index.scss'
import 'intersection-observer'
import './utils/polyfill'
import vhCheck from 'vh-check'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueShortKey from 'vue-shortkey'
import PortalVue from 'portal-vue'

vhCheck()
Vue.use(PortalVue)
Vue.use(VueShortKey, { prevent: ['input', 'textarea', '.ProseMirror'] })
window.store = store

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
  Collapse,
  CollapseItem,
  ColorPicker,
  Image,
  Loading,
  Tooltip,
  Popover,
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
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(ColorPicker)
Vue.use(Image)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Loading.directive)

Vue.mixin({
  computed: {
    isProductionMode: () => store.getters['mode/isProductionMode'],
    isPreviewMode: () => store.getters['mode/isPreviewMode'],
    isDraftMode: () => store.getters['mode/isDraftMode']
  }
})

// eslint-disable-next-line
Vue.prototype.$log = console.log
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

const app = new Vue({
  render: h => h(App),
  store
}).$mount('#app')

if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}
