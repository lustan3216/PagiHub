import basic from './basic'
import { colorAlpha, string } from '../util'

const activeColor = 'activeColor'
const inactiveColor = 'inactiveColor'
const activeText = 'activeText'
const inactiveText = 'inactiveText'

export const defaultSetting = {
  field: 'formCheckbox',
  ...basic.showLabel.value,
  ...basic.disabled.value,

  [activeColor]: '#409EFF',
  [inactiveColor]: '#C0CCDA',

  [activeText]: 'activeText',
  [inactiveText]: 'inactiveText'
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,

  [activeColor]: colorAlpha(activeColor),
  [inactiveColor]: colorAlpha(inactiveColor),

  [activeText]: string(activeText),
  [inactiveText]: string(inactiveText)
}
