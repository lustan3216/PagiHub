export const number = field => ({
  field,
  title: field,
  type: 'InputNumber',
  info: '123123123'
})

export const select = (field, { options }) => ({
  field,
  title: field,
  type: 'select',
  options: options.map(label => ({ value: label, label }))
})

export const selectCreate = (field, { options } = {}) => ({
  field,
  title: field,
  type: 'select',
  value: options,
  props: {
    noDataText: '可以打字製造',
    allowCreate: true,
    multiple: true,
    filterable: true,
    placeholder: '请选择文章标签'
  }
})

export const string = (field, { validate = [] } = {}) => ({
  type: 'input',
  field,
  title: field,
  validate
})

export const slider = (field, { step = 0.1, min = 0, max = 1 }) => {
  return {
    type: 'slider',
    title: field,
    field,
    props: {
      step,
      min,
      max
    }
  }
}

export const boolean = field => ({
  field,
  title: field,
  type: 'switch'
})

export const color = field => ({
  field,
  title: field,
  type: 'ColorPicker'
})

export const colorAlpha = field => ({
  field,
  title: field,
  type: 'ColorPicker',
  props: {
    showAlpha: true
  }
})

export const datepicker = field => ({
  field,
  title: field,
  type: 'DatePicker',
  props: {
    type: 'datetime'
  }
})
