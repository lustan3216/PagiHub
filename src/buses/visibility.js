import { bus } from '../main'

const KEY = 'visibleChange'

export function emitVisibleChange(id, { visible }) {
  bus.$emit(`${KEY}:${id}`, {
    visible
  })
}

export function onVisibleChange(id, element) {
  bus.$on(`${KEY}:${id}`, ({ visible }) => {
    element.style.visibility = visible ? 'visible' : 'hidden'
  })
}
