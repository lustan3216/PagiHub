import { generateStyleBlock } from './parser'
import { kebabCase } from '@/utils/string'
import { deepEqual } from 'vue-observe-visibility/src/utils'

export const FREE_STYLE = '@@FREE_STYLE'
window[FREE_STYLE] = window[FREE_STYLE] || {}

// 做這個是為了要改3th party component裡面的style, 考慮需不需要用
// 還有hover click active, 有sudo的css, 用style做不出來

export default {
  bind(element, { value }) {
    console.log('bind')
    if (value) {
      const styleId = getDataStyleId(element, value)
      generateStyleBlock(styleId, element, value)
    }
  },
  update(element, { value, oldValue }) {
    console.log('update', value.id)
    if (deepEqual(value, oldValue)) return
    if (value) {
      const styleId = getDataStyleId(element, value)
      generateStyleBlock(styleId, element, value)
    }
  },
  unbind(element, { value }) {
    console.log('unbind', value.id)
    if (value) {
      const styleId = getDataStyleId(element, value)
      const el = window[FREE_STYLE][styleId]

      if (el) {
        el.remove()
      }
    }
  }
}

function getDataStyleId(element, value) {
  const { id } = value

  if (id) {
    element.dataset.styleId = id
    return `[data-style-id="${id}"]`
  }
  else {
    const dataVIds = Object.keys(element.dataset).filter(x => x[0] === 'v')

    return dataVIds.reduce((acc, id) => {
      acc += `[data-${kebabCase(id)}]`
      return acc
    }, '')
  }
}
