import { cloneJson } from 'json-storer/src/utils'
import { isUndefined, isString } from 'element-ui/src/utils/types'
import isPlainObject from 'is-plain-object'
import merge from 'lodash/merge'

export { cloneJson, isUndefined, isPlainObject, isString, merge }

export const isArray = Array.isArray

export function toArray(e) {
  if (isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

export function arraySubtract(a, b) {
  return a.filter(n => !toArray(b).includes(n))
}

export function traversal(nodes, fn, parentNode) {
  toArray(nodes).forEach(node => {
    fn(node, parentNode)
    node.children && node.children.length && traversal(node.children, fn, node)
  })
}

export function deepFlatten(array) {
  return array.reduce((all, x) => {
    if (x.children) {
      all = all.concat(deepFlatten(x.children))
    }
    return all
  }, array)
}
