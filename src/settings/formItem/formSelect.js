import basic from './basic'
import { number, boolean, string } from '../util'

const multiple = 'multiple'
const multipleLimit = 'multipleLimit'
const filterable = 'filterable'
const allowCreate = 'allowCreate'
const noMatchText = 'noMatchText'
const noDataText = 'noDataText'

export const defaultSetting = {
  field: 'formSelect',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  ...basic.size.value,
  ...basic.clearable.value,
  ...basic.options.value,
  ...basic.placeholder.value,

  [multiple]: false,
  [filterable]: false,
  [allowCreate]: false,

  [multipleLimit]: 0,
  [noMatchText]: '无匹配数据',
  [noDataText]: '无数据',

  value: ['example1']
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  ...basic.size.spec,
  ...basic.clearable.spec,
  ...basic.placeholder.spec,
  ...basic.options.spec,

  [noDataText]: string(noDataText),
  [noMatchText]: string(noMatchText),
  [allowCreate]: boolean(allowCreate),
  [filterable]: boolean(filterable),
  [multiple]: boolean(multiple),
  [multipleLimit]: number(multipleLimit)
}
