import { generateStyleBlock } from './parser'
import { kebabCase } from '@/utils/string'

export const FREE_STYLE = '@@FREE_STYLE'
window[FREE_STYLE] = window[FREE_STYLE] || {}

// 做這個是為了要改3th party component裡面的style, 考慮需不需要用
// 還有hover click active, 有sudo的css, 用style做不出來

export default {
  bind(element, binding) {
    if (binding.value) {
      const styleId = getDataStyleId(element, binding)
      generateStyleBlock(styleId, element, binding.value)
    }
  },
  update(element, binding) {
    if (binding.value) {
      const styleId = getDataStyleId(element, binding)
      generateStyleBlock(styleId, element, binding.value)
    }
  },
  unbind(element, binding) {
    if (binding.value) {
      const styleId = getDataStyleId(element, binding)
      const el = window[FREE_STYLE][styleId]

      if (el) {
        el.remove()
      }
    }
  }
}

function getDataStyleId(element, binding) {
  const { id } = binding.value

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
