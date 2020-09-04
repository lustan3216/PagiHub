import { off, on } from 'element-ui/src/utils/dom'
import { isUndefined } from 'element-ui/src/utils/types'
import getValueByPath from 'lodash.get'
import setValueByPath from 'lodash.set'
import { isArray } from '@/utils/array'
import DeepMerge from 'deepmerge'

export { getValueByPath, setValueByPath, on, off, isUndefined }

export function deepMerge(a = {}, b = {}, c) {
  return DeepMerge(a, b, c)
}

deepMerge.all = array => DeepMerge.all(array.filter(x => x))

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
