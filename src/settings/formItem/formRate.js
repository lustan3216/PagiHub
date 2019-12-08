import basic from './basic'
import { number, boolean, colorAlpha, selectCreate } from '../util'

const max = 'max'
const lowThreshold = 'lowThreshold'
const highThreshold = 'highThreshold'
const allowHalf = 'allowHalf'

const lowColor = 'lowColor'
const midColor = 'midColor'
const highColor = 'highColor'

const voidColor = 'voidColor'
const disabledVoidColor = 'disabledVoidColor'

const showText = 'showText'
const textColor = 'textColor'
const showScore = 'showScore'
const texts = 'texts'

export const defaultSetting = {
  field: 'formInputNumber',
  ...basic.showLabel.value,
  ...basic.disabled.value,
  [max]: 5,
  [lowThreshold]: 1,
  [highThreshold]: 1,
  [allowHalf]: true,

  [lowColor]: '#F7BA2A',
  [midColor]: '#F7BA2A',
  [highColor]: '#F7BA2A',

  [voidColor]: '#C6D1DE',
  [disabledVoidColor]: '#EFF2F7',

  [showText]: true,
  [textColor]: '#1F2D3D',
  [showScore]: false,
  [texts]: ['极差', '失望', '一般', '满意', '惊喜']
}

export default {
  ...basic.field.spec,
  ...basic.showLabel.spec,
  ...basic.disabled.spec,
  [max]: number(max),
  [lowThreshold]: number(lowThreshold),
  [highThreshold]: number(highThreshold),
  [allowHalf]: boolean(allowHalf),

  [lowColor]: colorAlpha(lowColor),
  [midColor]: colorAlpha(midColor),
  [highColor]: colorAlpha(highColor),

  [voidColor]: colorAlpha(voidColor),
  [disabledVoidColor]: colorAlpha(disabledVoidColor),

  [showText]: boolean(showText),
  [textColor]: colorAlpha(textColor),
  [showScore]: boolean(showScore),
  [texts]: selectCreate(texts)
}
