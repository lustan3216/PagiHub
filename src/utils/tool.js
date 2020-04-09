import Vue from 'vue'
import { cloneJson } from 'json-storer/src/utils'
import merge from 'element-ui/src/utils/merge'
import { isUndefined, isString } from 'element-ui/src/utils/types'
import isPlainObject from 'is-plain-object'

export { cloneJson, isUndefined, isPlainObject, isString, merge }

export const isArray = Array.isArray

export function allEqual(arr) {
  return arr.every(v => v === arr[0])
}

export function toArray(e) {
  if (isArray(e)) {
    return e
  } else if (e === undefined) {
    return []
  } else {
    return [e]
  }
}

//
export function vueNestedMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Vue.set(target, key, {})
        vueNestedMerge(target[key], source[key])
      } else {
        Vue.set(target, key, source[key])
      }
    }
  }

  return vueNestedMerge(target, ...sources)
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

export function findBy(children, key, value) {
  return children.find(x => x[key] === value)
}

export function findIndexBy(children, key, value) {
  return children.findIndex(x => x[key] === value)
}

export function deleteBy(children, key, value) {
  const oldIndex = findIndexBy(children, key, value)
  children.splice(oldIndex, 1)
}

export function nestedToLinerObject(target, nestedObject, key = 'children') {
  traversal(nestedObject, _node => {
    // eslint-disable-next-line
    const { children: _, ...node } = _node
    target[node.id] = node
  })

  return target
}