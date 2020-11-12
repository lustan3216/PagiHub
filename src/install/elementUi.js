import {
  Divider,
  Tooltip,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Row,
  Col,
  Loading,
  Form,
  FormItem
} from 'element-ui'

export default function(Vue) {
  Vue.use(Divider)
  Vue.use(Tooltip)
  Vue.use(Dialog)
  Vue.use(Dropdown)
  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)
  Vue.use(Input)
  Vue.use(Checkbox)
  Vue.use(CheckboxButton)
  Vue.use(CheckboxGroup)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(OptionGroup)
  Vue.use(Button)
  Vue.use(ButtonGroup)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Loading.directive)

  Vue.prototype.$ELEMENT = { size: 'mini' }
  Vue.prototype.$loading = Loading.service
}
