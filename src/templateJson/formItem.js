import {
  INITIATE,
  VALUE,
  PROPS,
  TAG,
  VALIDATE,
  FIELD,
  CAN_DRAG,
  CAN_EDIT
} from '../const'

export const formSubmit = () => ({
  [TAG]: 'form-submit',
  [CAN_EDIT]: true,
  [INITIATE]: true
})

export const formInput = () => ({
  [TAG]: 'form-input',
  [FIELD]: '商品名称',
  [VALUE]: 'iphone 7',
  [CAN_EDIT]: true,
  [PROPS]: {
    type: 'text'
  },
  [VALIDATE]: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
})

export const formTextarea = () => ({
  [TAG]: 'form-textarea',
  [CAN_EDIT]: true
})

export const formInputNumber = () => ({
  [TAG]: 'form-number'
})

export const formRadio = () => ({
  [TAG]: 'form-radio'
})

export const formCheckBox = () => ({
  [TAG]: 'form-checkbox'
})

export const formSelect = () => ({
  [TAG]: 'form-select'
})

export const formSwitch = () => ({
  [TAG]: 'form-switch'
})

export const formDatePicker = () => ({
  [TAG]: 'form-date-picker'
})

export const formTimePicker = () => ({
  [TAG]: 'form-time-picker'
})

export const formColorPicker = () => ({
  [TAG]: 'form-color-picker'
})

export const formRate = () => ({
  [TAG]: 'form-rate'
})

export const formSlider = () => ({
  [TAG]: 'form-slider',
  [CAN_DRAG]: true
})

export default [
  formSubmit(),
  formTextarea(),
  formInput(),
  formInputNumber(),
  formRadio(),
  formCheckBox(),
  formSelect(),
  formSwitch(),
  formDatePicker(),
  formTimePicker(),
  formColorPicker(),
  formRate(),
  formSlider()
]
