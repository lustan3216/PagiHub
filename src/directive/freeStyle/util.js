import { camelCase, kebabCase } from '@/utils/string'

function cached(fn) {
  const cache = Object.create(null)
  return function cachedFn(str1, str2) {
    const key = `${str1}${str2}`
    const hit = cache[key]
    return hit || (cache[key] = fn(str1, str2))
  }
}

const vendorNames = ['Webkit', 'Moz', 'ms']

let emptyStyle
const normalize = cached(function(prop, value) {
  emptyStyle = emptyStyle || document.createElement('div').style
  prop = camelCase(prop)
  if (prop !== 'filter' && prop in emptyStyle) {
    return kebabCase(prop)
  }

  const capName = prop.charAt(0).toUpperCase() + prop.slice(1)
  for (let i = 0; i < vendorNames.length; i++) {
    const name_1 = vendorNames[i] + capName
    if (name_1 in emptyStyle) {
      const node = document.createElement('div')
      node.style[name_1] = value
      const style = node.getAttribute('style')
      const realName = style && node.getAttribute('style').split(':')[0]

      if (realName) {
        return kebabCase(realName)
      }
    }
  }
})

const classAppendIds = cached(function(klass, styleId) {
  const hasVDeep = klass.match('::v-deep')

  if (hasVDeep) {
    return klass.replace('::v-deep', styleId)
  }
  else {
    const index = lastIndexOfPseudo(klass)

    if (index >= 0) {
      return stringInsert(klass, styleId, index)
    }
    else {
      return klass.trim() + styleId
    }
  }
})

const stringInsert = function(string, text, index) {
  return [string.slice(0, index), text, string.slice(index)].join('')
}

const lastIndexOfPseudo = cached(function(string) {
  const arr = string.split(' ')
  const last = arr[arr.length]
  return last.lastIndexOf(':')
})

export function createTextNode(text) {
  const head = document.head || document.getElementsByTagName('head')[0]
  const element = document.createElement('style')
  head.appendChild(element)
  element.type = 'text/css'
  // This is required for IE8 and below.
  if (element.styleSheet) {
    // @ts-ignore
    element.styleSheet.cssText = text
  }
  else {
    element.appendChild(document.createTextNode(text))
  }
  return element
}

export function mixClassesAndIds(cssBlock, styleId) {
  const classNameMatch = cssBlock.match(/.+(?={)/g)
  if (classNameMatch && classNameMatch[0]) {
    const classes = classNameMatch[0].split(',')
    return classes
      .reduce(function(acc, klass) {
        const mixed = classAppendIds(klass, styleId)
        acc.push(mixed)
        return acc
      }, [])
      .join(',')
  }
  else {
    return styleId
  }
}

export function objectHasValue(object) {
  if (!isUndefined(object)) {
    return Object.values(object).filter(x => !isUndefined(x)).length
  }
}

function isUndefined(x) {
  return x === undefined
}

export function prefixAttributes(inlineStyles) {
  const keys = Object.keys(inlineStyles)
  return keys.reduce(function(acc, key) {
    const normalized = normalize(key, inlineStyles[key])
    if (normalized) {
      acc += `  ${normalized}: ${inlineStyles[key]};\n`
    }
    return acc
  }, '')
}

export const parseStyleText = cached(function(cssText) {
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
