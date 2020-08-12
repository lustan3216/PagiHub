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
    //   default: {
    //     display: 'block',
    //     color: 'black',
    //   }
    //   ':active': {
    //     display: 'block',
    //     color: 'black',
    //   }
    // }
    ['default', ':hover', ':active'].forEach(effect => {
      const styleObject = style[effect]

      if (objectHasValue(styleObject)) {
        const prefixedStyles = prefixAttributes(styleObject)
        const parsedClass = mixClassesAndIds('', styleId)
        parsedCssBlocks += parsedClass + ' {\n' + prefixedStyles + '}\n'
      }
    })
  }
  // else {
  //   // style: string
  //   // .class {
  //   //   display: block;
  //   //   color: black;
  //   // }
  //   // .class1 .class2:active{
  //   //   display: block;
  //   //   color: black;
  //   // }
  //   const cssBlocks = style.trim().match(/[^}]+{[^}|.]+}/g)
  //   parsedCssBlocks = cssBlocks.reduce(function(acc, cssBlock) {
  //     const stylesString = cssBlock.match(/{([^{}]+)}/g)[0].replace(/[{}]/g, '')
  //     const stylesObject = parseStyleText(stylesString)
  //     const prefixedStyles = prefixAttributes(stylesObject)
  //
  //     const parsedClass = mixClassesAndIds(cssBlock, styleId)
  //     acc += parsedClass + ' {\n' + prefixedStyles + '}\n'
  //     return acc
  //   }, '')
  // }

  const tree = window[FREE_STYLE]

  // 不知道為什麼有時css node 會不見，乾脆每次都刪掉重建
  if (tree[styleId]) {
    tree[styleId].remove()
    delete tree[styleId]
  }

  if (parsedCssBlocks.trim().length) {
    tree[styleId] = createTextNode(parsedCssBlocks)
  }
}
