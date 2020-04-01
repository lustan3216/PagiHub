/* eslint-disabled */
import { kebabCase, capitalize } from 'element-ui/src/utils/util'
import { isUndefined } from 'element-ui/src/utils/types'
import { isPlainObject } from '../lodash'

export { isPlainObject, isUndefined }

export function toArray(e) {
  if (Array.isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

Array.toArray = toArray

Array.uniq = function(e) {
  return [...new Set(e)]
}

Array.last = function(e) {
  return e[e.length - 1]
}

Array.first = function(e) {
  return e[0]
}

Array.prototype.subtract = function(e) {
  return this.filter(n => !Array.toArray(e).includes(n))
}

Object.isPlainObject = isPlainObject

Object.firstKey = function(e) {
  return Object.keys(e)[0]
}

Object.firstValue = function(e) {
  if (isPlainObject(e)) {
    return Object.values(e)[0]
  } else {
    return e
  }
}

String.prototype.capitalize = function() {
  return capitalize(this)
}

String.prototype.kebabCase = function() {
  return kebabCase(this)
}

String.prototype.camelCase = function() {
  if (!this) return ''

  return this.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace(/[-_]/g, '')
  )
}

Number.prototype.isFloat = function() {
  return Number(this) === this && this % 1 !== 0
}
