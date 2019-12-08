import basic from './basic'
import { number, boolean, select } from '../util'

const step = 'step'
const precision = 'precision'
const controls = 'controls'
const controlsPosition = 'controlsPosition'

export const defaultSetting = {
  field: 'formInputNumber',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  ...basic.size.value,
  ...basic.min.value,
  ...basic.min.value,
  [step]: 1,
  [precision]: 1,
  [controls]: true,
  [controlsPosition]: 'right'
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
  [controls]: boolean(controls),
  [controlsPosition]: select(controlsPosition, { options: ['right', 'left'] })
}
