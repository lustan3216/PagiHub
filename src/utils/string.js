import { kebabCase, capitalize } from 'element-ui/src/utils/util'

export { kebabCase, capitalize }

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
  return capitalize(kebabCase(value)).replace(
    /-(\w)/g,
    x => ` ${x[1].toUpperCase()}`
  )
}
