import { kebabCase, capitalize } from 'element-ui/src/utils/util'
import { isString } from 'element-ui/src/utils/types'

export { isString, kebabCase, capitalize }

export function camelCase(value) {
  if (!value) return ''

  return value.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace(/[-_]/g, '')
  )
}

export function bigCamelCase(value) {
  if (!value) return ''

  return capitalize(camelCase(value))
}

export function humanize(value) {
  if (!value) {
    return value
  }
  return capitalize(kebabCase(value)).replace(
    /-(\w)/g,
    x => ` ${x[1].toUpperCase()}`
  )
}

export function splitAt(string, index) {
  return [string.slice(0, index), string.slice(index)]
}
