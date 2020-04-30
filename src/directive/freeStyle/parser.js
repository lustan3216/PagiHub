import {
  createTextNode,
  mixClassesAndIds,
  prefixAttributes,
  parseStyleText
} from './util'

import { FREE_STYLE } from './index'
import { isPlainObject } from '@/utils/tool'

export function generateStyleBlock(uid, element, style) {
  let parsedCssBlocks
  const datasetIds = Object.keys(element.dataset)
  const cssBlocks = style.match(/[^}]+{[^}|.]+}/g)

  // style: object
  // {
  //   display: 'block',
  //   color: 'black'
  // }
  // style: string
  // .class {
  //   display: block;
  //   color: black;
  // }
  // .class1 {
  //   display: block;
  //   color: black;
  // }
  //
  if (isPlainObject(style)) {
    const prefixedStyles = prefixAttributes(style)
    const parsedClass = mixClassesAndIds('', datasetIds)
    parsedCssBlocks = parsedClass + ' {\n' + prefixedStyles + '}\n'
  } else {
    parsedCssBlocks = cssBlocks.reduce(function(acc, cssBlock) {
      const stylesString = cssBlock.match(/{([^{}]+)}/g)[0].replace(/[{}]/g, '')
      const stylesObject = parseStyleText(stylesString)
      const prefixedStyles = prefixAttributes(stylesObject)

      const parsedClass = mixClassesAndIds(cssBlock, datasetIds)
      acc += parsedClass + ' {\n' + prefixedStyles + '}\n'
      return acc
    }, '')
  }

  const tree = window[FREE_STYLE]

  if (tree[uid]) {
    tree[uid].textContent = parsedCssBlocks
  } else {
    tree[uid] = createTextNode(parsedCssBlocks)
  }
}
