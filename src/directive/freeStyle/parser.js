import {
  createTextNode,
  mixClassesAndIds,
  prefixAttributes,
  parseStyleText
} from './util'

import { FREE_STYLE } from './index'

export function generateStyleBlock(uid, element, style) {
  const datasetIds = Object.keys(element.dataset)
  const cssBlocks = style.match(/[^}]+{[^}|.]+}/g)

  const parsedCssBlocks = cssBlocks.reduce(function(acc, cssBlock) {
    const stylesBlock = cssBlock.match(/{([^{}]+)}/g)[0].replace(/[{}]/g, '')
    const inlineStyles = parseStyleText(stylesBlock)
    const prefixedStyles = prefixAttributes(inlineStyles)

    const parsedClass = mixClassesAndIds(cssBlock, datasetIds)
    acc += parsedClass + ' {\n' + prefixedStyles + '}\n'
    return acc
  }, '')

  const tree = window[FREE_STYLE]

  if (tree[uid]) {
    tree[uid].textContent = parsedCssBlocks
  } else {
    tree[uid] = createTextNode(parsedCssBlocks)
  }
}
