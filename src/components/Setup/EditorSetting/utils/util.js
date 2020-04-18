import { getValueByPath, isPlainObject } from '../../../../utils/tool'

export const assignDefaultValue = (array, defaultSetting) => {
  array.forEach(object => {
    if (object.path) {
      object.value = getValueByPath(
        defaultSetting,
        `${object.path}.${object.field}`
      )
    } else {
      object.value = defaultSetting[object.field]
    }
  })

  return array
}

export const number = (field, extraOptions) => ({
  field,
  title: field,
  type: 'InputNumber',
  ...extraOptions
})

export const select = (field, { options, ...extraOptions } = {}) => {
  if (!isPlainObject(options[0])) {
    options = options.map(label => ({ value: label, label }))
  }

  return {
    field,
    title: field,
    type: 'select',
    options,
    ...extraOptions
  }
}

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

export const string = (field, extraOptions) => ({
  field,
  type: 'input',
  title: field,
  ...extraOptions
})

export const slider = (field, { step = 0.1, min = 0, max = 1 }) => {
  return {
    field,
    type: 'slider',
    title: field,
    props: {
      step,
      min,
      max
    }
  }
}

export const boolean = (field, extraOptions) => ({
  field,
  title: field,
  type: 'switch',
  ...extraOptions
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

export const selectUnit = (field, extraOptions) => ({
  field,
  title: field,
  type: 'SelectUnit',
  ...extraOptions
})
