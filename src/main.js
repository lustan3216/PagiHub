import 'normalize.css'
import './styles/vender.scss'
import './styles/index.scss'
import 'intersection-observer'
import '@babel/polyfill'
import './utils/polyfill'
import vhCheck from 'vh-check'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueShortKey from 'vue-shortkey'
import PortalVue from 'portal-vue'
import VueObserveVisibility from 'vue-observe-visibility'

vhCheck()
Vue.use(VueObserveVisibility)
window.store = store
Vue.use(PortalVue)
Vue.use(VueShortKey)

import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
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
  Form,
  FormItem,
  Tabs,
  TabPane,
  Row,
  Col,
  Card,
  Collapse,
  CollapseItem,
  ColorPicker,
  Container,
  Header,
  Aside,
  Main,
  Divider,
  Image,
  Loading,
  Tooltip,
  Popover
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
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
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(ColorPicker)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Divider)
Vue.use(Image)
Vue.use(Tooltip)
Vue.use(Popover)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service

Vue.mixin({
  computed: {
    isProductionMode: () => store.getters['mode/isProductionMode'],
    isPreviewMode: () => store.getters['mode/isPreviewMode'],
    isDraftMode: () => store.getters['mode/isDraftMode']
  }
})

const bus = new Vue()

// eslint-disable-next-line
Vue.prototype.$log = console.log
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

window.Vue = Vue

const app = new Vue({
  render: h => h(App),
  store
}).$mount('#app')
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
}

export { bus }
