import { VALUE, PROPS, TAG, VALIDATE, FIELD } from '../const'

export const formSubmit = () => ({
  [TAG]: 'form-submit'
})

export const formLabel = () => ({
  [TAG]: 'form-label'
})

export const formReset = () => ({
  [TAG]: 'form-reset'
})

export const formInput = () => ({
  [TAG]: 'form-input',
  [FIELD]: '商品名称',
  [VALUE]: 'iphone 7',
  [PROPS]: {
    type: 'text'
  },
  [VALIDATE]: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
})

export const formTextarea = () => ({
  [TAG]: 'form-textarea'
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
  [TAG]: 'form-slider'
})

export default [
  formLabel(),
  formSubmit(),
  formReset(),
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
