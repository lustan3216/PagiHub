import { cached } from '@/utils/tool'
import { camelCase, kebabCase } from '@/utils/string'

const vendorNames = ['Webkit', 'Moz', 'ms']

let emptyStyle
const normalize = cached(function(prop) {
  emptyStyle = emptyStyle || document.createElement('div').style
  prop = camelCase(prop)
  if (prop !== 'filter' && prop in emptyStyle) {
    return prop
  }
  const capName = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < vendorNames.length; i++) {
    const name_1 = vendorNames[i] + capName
    if (name_1 in emptyStyle) {
      return name_1
    }
  }
})

function createTextNode(text) {
  const head = document.head || document.getElementsByTagName('head')[0]
  const element = document.createElement('style')
  head.appendChild(element)
  element.type = 'text/css'
  // @ts-ignore
  // This is required for IE8 and below.
  if (element.styleSheet) {
    // @ts-ignore
    element.styleSheet.cssText = text
  } else {
    element.appendChild(document.createTextNode(text))
  }
  return element
}

function mixClassesAndIds(cssBlock, dataSetIds) {
  const classes = cssBlock.match(/.+(?={)/g)[0].split(',')
  return classes
    .reduce(function(acc, klass) {
      const mixed = _classAppendIds(klass, dataSetIds)
      acc.push(mixed)
      return acc
    }, [])
    .join(',')
}

function _classAppendIds(klass, ids) {
  const kebabId = ids.reduce((acc, id) => {
    acc += `[data-${kebabCase(id)}]`
    return acc
  }, '')

  const hasVDeep = klass.match('::v-deep')

  if (hasVDeep) {
    return klass.replace('::v-deep', kebabId)
  } else {
    return klass.trim() + kebabId
  }
}

function prefixAttributes(inlineStyles) {
  const keys = Object.keys(inlineStyles)
  return keys.reduce(function(acc, key) {
    const normalized = kebabCase(normalize(camelCase(key)))
    acc += `  ${normalized}: ${inlineStyles[key]};\n`
    return acc
  }, '')
}

const parseStyleText = cached(function(cssText) {
  const res = {}
  const listDelimiter = /;(?![^(]*\))/g
  const propertyDelimiter = /:(.+)/
  cssText.split(listDelimiter).forEach(function(item) {
    if (item) {
      const tmp = item.split(propertyDelimiter)
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim())
    }
  })
  return res
})

export { createTextNode, mixClassesAndIds, prefixAttributes, parseStyleText }
