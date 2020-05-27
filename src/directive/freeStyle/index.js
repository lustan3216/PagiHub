import { generateStyleBlock } from './parser'
import { kebabCase } from '@/utils/string'

export const FREE_STYLE = '@@FREE_STYLE'
window[FREE_STYLE] = window[FREE_STYLE] || {}

export default function freeStyle(element, binding) {
  const styleId = getStringId(element, binding)

  if (binding.value) {
    generateStyleBlock(styleId, element, binding.value)
  } else if (binding.value === false) {
    clean(styleId)
  }
}

export const directive = {
  bind: freeStyle,
  update: freeStyle,
  unbind(element, binding) {
    clean(getStringId(element, binding))
  }
}

function clean(styleId) {
  const el = window[FREE_STYLE][styleId]

  if (el) {
    el.remove()
  }
}

function getStringId(element, binding) {
  const { id } = binding.value

  if (id) {
    element.dataset.styleId = id
    return `[data-style-id="${id}"]`
  } else {
    const dataVIds = Object.keys(element.dataset).filter(x => x[0] === 'v')

    return dataVIds.reduce((acc, id) => {
      acc += `[data-${kebabCase(id)}]`
      return acc
    }, '')
  }
}
