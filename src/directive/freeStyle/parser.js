import {
  createTextNode,
  mixClassesAndIds,
  prefixAttributes,
  objectHasValue,
  parseStyleText
} from './util'

import { FREE_STYLE } from './index'
import { isPlainObject } from '@/utils/tool'

export function generateStyleBlock(styleId, element, style) {
  let parsedCssBlocks = '\n'
  if (isPlainObject(style)) {
    // style: object
    // {
    //   display: 'block',
    //   color: 'black',
    //   ':active': {
    //     display: 'block',
    //     color: 'black',
    //   }
    // }
    const defaultStyles = style.default
    if (objectHasValue(defaultStyles)) {
      const prefixedStyles = prefixAttributes(defaultStyles)
      const parsedClass = mixClassesAndIds('', styleId)
      parsedCssBlocks += parsedClass + ' {\n' + prefixedStyles + '}\n'
    }

    const pseudos = Object.keys(style).filter(key => key[0] === ':')
    pseudos.forEach(key => {
      if (style[key] && objectHasValue(style[key])) {
        const prefixedStyles = prefixAttributes(style[key])
        const parsedClass = mixClassesAndIds('', styleId) + key
        parsedCssBlocks += parsedClass + ' {\n' + prefixedStyles + '}\n'
      }
    })
  } else {
    // style: string
    // .class {
    //   display: block;
    //   color: black;
    // }
    // .class1 .class2:active{
    //   display: block;
    //   color: black;
    // }
    const cssBlocks = style.trim().match(/[^}]+{[^}|.]+}/g)
    parsedCssBlocks = cssBlocks.reduce(function(acc, cssBlock) {
      const stylesString = cssBlock.match(/{([^{}]+)}/g)[0].replace(/[{}]/g, '')
      const stylesObject = parseStyleText(stylesString)
      const prefixedStyles = prefixAttributes(stylesObject)

      const parsedClass = mixClassesAndIds(cssBlock, styleId)
      acc += parsedClass + ' {\n' + prefixedStyles + '}\n'
      return acc
    }, '')
  }

  const tree = window[FREE_STYLE]

  if (!parsedCssBlocks.trim().length) {
    return
  }

  if (tree[styleId]) {
    tree[styleId].textContent = parsedCssBlocks
  } else {
    tree[styleId] = createTextNode(parsedCssBlocks)
  }
}
