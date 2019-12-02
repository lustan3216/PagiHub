import { pxPercent } from './validation'
import { number, boolean, select, string } from './util'

const displayLabel = 'displayLabel'
const inline = 'inline'
const labelPosition = 'labelPosition'
const size = 'size'
const hideRequiredAsterisk = 'hideRequiredAsterisk'
const showMessage = 'showMessage'
const inlineMessage = 'inlineMessage'
const statusIcon = 'statusIcon'
const labelWidth = 'labelWidth'
const gutter = 'gutter'
const align = 'align'
const justify = 'justify'
const type = 'type'

const defaultFormSetting = {
  [displayLabel]: true,
  [inline]: false,
  [labelPosition]: 'left',
  [size]: 'small',
  [hideRequiredAsterisk]: true,
  [showMessage]: true,
  [inlineMessage]: true,
  [statusIcon]: true,
  [labelWidth]: '125px'
}

const defaultRowSetting = {
  [gutter]: 0,
  [align]: 'middle',
  [justify]: 'start'
}

const defaultInfoSetting = {
  [type]: 0
}

export const defaultSetting = {
  form: defaultFormSetting,
  row: defaultRowSetting,
  info: defaultInfoSetting
}

export default {
  form: {
    [displayLabel]: boolean(displayLabel, { value: defaultFormSetting[displayLabel] }),
    [inline]: boolean(inline, { value: defaultFormSetting[inline] }),
    [labelPosition]: select(labelPosition, { value: defaultFormSetting[labelPosition], options: ['left', 'right'] }),
    [size]: select(size, { value: defaultFormSetting[size], options: ['mini', 'small', 'medium'] }),
    [hideRequiredAsterisk]: boolean(hideRequiredAsterisk, { value: defaultFormSetting[hideRequiredAsterisk] }),
    [showMessage]: boolean(showMessage, { value: defaultFormSetting[showMessage] }),
    [inlineMessage]: boolean(inlineMessage, { value: defaultFormSetting[inlineMessage] }),
    [statusIcon]: boolean(statusIcon, { value: defaultFormSetting[statusIcon] }),
    [labelWidth]: string(labelWidth, {
      value: defaultFormSetting[labelWidth],
      validate: [pxPercent]
    })
  },
  row: {
    [gutter]: number(gutter, { value: defaultRowSetting[gutter] }),
    [align]: select(align, { value: defaultRowSetting[align], options: ['middle', 'top', 'bottom'] }),
    [justify]: select(justify, {
      value: defaultRowSetting[justify],
      options: ['start', 'end', 'center', 'space-around', 'space-between']
    })
  },
  info: {
    [type]: select(type, { value: defaultInfoSetting[type], options: ['poptip', 'tooltip'] })
  }
}

//   行内表单模式
//   inline: false,
//   //表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
//   labelPosition: 'right',
//   //表单域标签的后缀
//   labelSuffix: undefined,
//   //是否显示必填字段的标签旁边的红色星号
//   hideRequiredAsterisk: false,
//   //表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。支持 auto。
//   labelWidth: '125px',
//   //是否显示校验错误信息
//   showMessage: true,
//   //是否以行内形式展示校验信息
//   inlineMessage: false,
//   //是否在输入框中显示校验结果反馈图标
//   statusIcon: false,
//   //是否在 rules 属性改变后立即触发一次验证
//   validateOnRuleChange: true,
//   //是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
//   disabled: false,
//   //用于控制该表单内组件的尺寸 medium / small / mini
//   size: undefined
