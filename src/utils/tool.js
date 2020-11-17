import { off, on } from 'element-ui/src/utils/dom'
import { isUndefined } from 'element-ui/src/utils/types'
import getValueByPath from 'lodash.get'
import setValueByPath from 'lodash.set'
import unsetValueByPath from 'lodash.unset'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import { isArray } from '@/utils/array'
import DeepMerge from 'deepmerge'
import { objectHasAnyKey } from '@/utils/object'

import {
  addResizeListener,
  removeResizeListener
} from 'element-ui/src/utils/resize-event'

export {
  getValueByPath,
  setValueByPath,
  unsetValueByPath,
  debounce,
  throttle,
  on,
  off,
  isUndefined
}

let timeIdMap = {}
export function globalDebounce(fn, sec) {
  const id = timeIdMap[fn]
  if (id) clearTimeout(id)

  timeIdMap = setTimeout(() => {
    fn()
    delete timeIdMap[fn]
  }, sec)
}

export function resizeListener(element, fn) {
  if (element) {
    addResizeListener(element, fn)
  }
  return () => element && removeResizeListener(element, fn)
}

export function isBoolean(value) {
  return typeof value === 'boolean'
}

export function unsetValueByPathNested(object, path) {
  unsetValueByPath(object, path)
  path.pop()
  const prevObject = getValueByPath(object, path)

  if (path.length && !objectHasAnyKey(prevObject)) {
    unsetValueByPathNested(object, path)
  }
}

const dontMerge = (destination, source) => source
export function deepMerge(a = {}, b = {}, c) {
  return DeepMerge(a, b, { ...c, arrayMerge: dontMerge })
}

deepMerge.all = array =>
  DeepMerge.all(
    array.filter(x => x),
    { arrayMerge: dontMerge }
  )

export function cloneJson(e) {
  return JSON.parse(JSON.stringify(e))
}

export function onWithOff(element, event, handler) {
  on(element, event, handler)
  return () => off(element, event, handler)
}

export function asyncGetValue(fn, timeout = 2000) {
  let id

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      reject()
      cancelAnimationFrame(id)
    }, timeout)

    const getValue = () => {
      let value
      if (isArray(fn)) {
        const [first, ...rest] = fn
        value = getValueByPath(first, rest)
      }
      else {
        value = fn()
      }

      if (isUndefined(value)) {
        id = requestAnimationFrame(getValue)
      }
      else {
        cancelAnimationFrame(id)
        resolve(value)
      }
    }

    id = requestAnimationFrame(getValue)
  })
}
