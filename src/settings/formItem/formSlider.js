import basic from './basic'
import { number, boolean, select } from '../util'

const step = 'step'
const precision = 'precision'
const showInput = 'showInput'
const showInputControls = 'showInputControls'
const showStops = 'showStops'
const showTooltip = 'showTooltip'
const range = 'range'
const vertical = 'vertical'
const height = 'height'

export const defaultSetting = {
  field: 'formSlider',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  ...basic.size.value,
  ...basic.min.value,
  ...basic.max.value,
  [step]: 1,
  [precision]: 1,
  [showInput]: true,
  [showInputControls]: true,
  [showStops]: false,
  [showTooltip]: true,
  [range]: true,
  [vertical]: false,
  height: '100%'
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  ...basic.size.spec,
  ...basic.min.spec,
  ...basic.max.spec,
  [step]: number(step),
  [precision]: number(precision),
  [showInput]: boolean(showInput),
  [showInputControls]: boolean(showInputControls),
  [showStops]: boolean(showStops),
  [showTooltip]: boolean(showTooltip),
  [range]: boolean(range),
  [vertical]: boolean(vertical)
}
