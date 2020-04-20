import { getValueByPath, isPlainObject, cloneJson } from '@/utils/tool'
import { urlPath } from './validation'

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
  title: field.readable(),
  type: 'InputNumber',
  ...extraOptions
})

export const select = (field, { options, ...extraOptions } = {}) => {
  options = cloneJson(options)
  options.forEach((option, index) => {
    if (!isPlainObject(option)) {
      options[index] = { value: option, label: option.capitalize() }
    }
  })

  return {
    field,
    title: field.readable(),
    type: 'select',
    options,
    ...extraOptions
  }
}

export const selectCreate = (field, { options } = {}) => ({
  field,
  title: field.readable(),
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
  title: field.readable(),
  ...extraOptions
})

export const url = (field, extraOptions) => ({
  field,
  type: 'input',
  title: field.readable(),
  validate: [urlPath],
  ...extraOptions
})

export const slider = (field, { step = 0.1, min = 0, max = 1 }) => {
  return {
    field,
    type: 'slider',
    title: field.readable(),
    props: {
      step,
      min,
      max
    }
  }
}

export const boolean = (field, extraOptions) => ({
  field,
  title: field.readable(),
  type: 'switch',
  ...extraOptions
})

export const color = field => ({
  field,
  title: field.readable(),
  type: 'ColorPicker'
})

export const colorAlpha = field => ({
  field,
  title: field.readable(),
  type: 'ColorPicker',
  props: {
    showAlpha: true
  }
})

export const datepicker = field => ({
  field,
  title: field.readable(),
  type: 'DatePicker',
  props: {
    type: 'datetime'
  }
})

export const selectUnit = (field, extraOptions) => ({
  field,
  title: field.readable(),
  type: 'SelectUnit',
  ...extraOptions
})
