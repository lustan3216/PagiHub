export const formSubmit = () => ({
  tag: 'form-submit'
})

export const formLabel = () => ({
  tag: 'form-label'
})

export const formReset = () => ({
  tag: 'form-reset'
})

export const formInput = () => ({
  tag: 'form-input',
  field: '商品名称',
  value: 'iphone 7',
  props: {
    type: 'text'
  },
  validate: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
})

export const formTextarea = () => ({
  tag: 'form-textarea'
})

export const formInputNumber = () => ({
  tag: 'form-number'
})

export const formRadio = () => ({
  tag: 'form-radio'
})

export const formCheckBox = () => ({
  tag: 'form-checkbox'
})

export const formSelect = () => ({
  tag: 'form-select'
})

export const formSwitch = () => ({
  tag: 'form-switch'
})

export const formDatePicker = () => ({
  tag: 'form-date-picker'
})

export const formTimePicker = () => ({
  tag: 'form-time-picker'
})

export const formColorPicker = () => ({
  tag: 'form-color-picker'
})

export const formRate = () => ({
  tag: 'form-rate'
})

export const formSlider = () => ({
  tag: 'form-slider'
})

export default function() {
  return {
    name: 'Form',
    icon: 'el-icon-message',
    components: [
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
  }
}
