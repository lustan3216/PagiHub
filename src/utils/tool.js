import { off, on } from 'element-ui/src/utils/dom'
import { isUndefined } from 'element-ui/src/utils/types'
import getValueByPath from 'lodash.get'
import setValueByPath from 'lodash.set'

export { getValueByPath, setValueByPath, on, off, isUndefined }

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
      const value = fn()

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
