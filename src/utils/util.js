import Vue from 'vue'
import { isPlainObject } from '../lodash'
import { cloneJson } from 'json-storer/src/utils'

export { cloneJson }

export function traversal(nodes, fn, parentNode) {
  Array.toArray(nodes).forEach(node => {
    fn(node, parentNode)
    node.children && node.children.length && traversal(node.children, fn, node)
  })
}

export function assignSet(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Vue.set(target, key, {})
        assignSet(target[key], source[key])
      } else {
        Vue.set(target, key, source[key])
      }
    }
  }

  return assignSet(target, ...sources)
}

export function deepFlatten(array) {
  return array.reduce((all, x) => {
    if (x.children) {
      all = all.concat(deepFlatten(x.children))
    }
    return all
  }, array)
}
