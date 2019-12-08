import basic from './basic'
import { colorAlpha, boolean } from '../util'

const textColor = 'text-color'
const fill = 'fill'
const button = 'button'

export const defaultSetting = {
  field: 'formRadio',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  ...basic.size.value,
  ...basic.min.value,
  ...basic.max.value,
  ...basic.options.value,

  [textColor]: '#ffffff',
  [fill]: '#409EFF',
  [button]: false,

  value: ['example1']
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  ...basic.size.spec,
  ...basic.min.spec,
  ...basic.max.spec,
  ...basic.options.spec,
  [textColor]: colorAlpha(textColor),
  [fill]: colorAlpha(fill),
  [button]: boolean(button)
}
