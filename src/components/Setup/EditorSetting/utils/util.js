import {
  getValueByPath,
  isPlainObject,
  cloneJson,
  isUndefined
} from '@/utils/tool'
import { urlPath } from './validation'

export const assignDefaultValue = (array, defaultSetting) => {
  array.forEach(object => {
    let value
    if (object.path) {
      value = getValueByPath(defaultSetting, `${object.path}.${object.field}`)
    } else {
      value = defaultSetting[object.field]
    }
    if (!isUndefined(value)) {
      object.value = value
    }
  })

  return array
}

export const number = (field, extraOptions = {}) => ({
  field,
  title: readable(extraOptions.title || field),
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

  if (isUndefined(extraOptions.props)) {
    extraOptions.props = { clearable: true }
  } else if (isUndefined(extraOptions.props.clearable)) {
    extraOptions.props.clearable = true
  }

  return {
    field,
    type: 'select',
    options,
    ...extraOptions,
    title: readable(extraOptions.title || field)
  }
}

export const selectCreate = (field, extraOptions = {}) => ({
  field,
  type: 'select',
  props: {
    noDataText: '可以打字製造',
    allowCreate: true,
    multiple: true,
    filterable: true,
    placeholder: '请选择文章标签'
  },
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const string = (field, extraOptions = {}) => ({
  field,
  type: 'input',
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const url = (field, extraOptions = {}) => ({
  field,
  type: 'input',
  validate: [urlPath],
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const slider = (field, extraOptions = {}) => {
  return {
    field,
    type: 'slider',
    ...extraOptions,
    title: readable(extraOptions.title || field)
  }
}

export const boolean = (field, extraOptions = {}) => ({
  field,
  type: 'switch',
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const color = (field, extraOptions = {}) => ({
  field,
  type: 'ColorPicker',
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const colorAlpha = (field, extraOptions = {}) => ({
  field,
  type: 'ColorPicker',
  props: {
    showAlpha: true
  },
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const datepicker = (field, extraOptions = {}) => ({
  field,
  type: 'DatePicker',
  props: {
    type: 'datetime'
  },
  ...extraOptions,
  title: readable(extraOptions.title || field)
})

export const selectUnit = (field, extraOptions = {}) => ({
  field,
  title: readable(extraOptions.title || field),
  type: 'SelectUnit',
  ...extraOptions
})

function readable(value) {
  return value
    .kebabCase()
    .capitalize()
    .replace(/-(\w)/g, x => ` ${x[1].toUpperCase()}`)
}
