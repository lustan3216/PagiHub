import { camelCase, kebabCase } from '@/utils/string'
import { normalize } from 'vue/src/platforms/web/runtime/modules/style'

const FREE_STYLE = '@@freeStyle'
window[FREE_STYLE] = window[FREE_STYLE] || {}

const styleDirective = {
  vm: null,
  bind(el, binding, vnode) {
    styleDirective.vm = vnode.context
    styleDirective.vm.$nextTick(() => parse(el))
  },
  update(el) {
    styleDirective.vm.$nextTick(() => parse(el))
  },
  unbind(el) {
    styleDirective.vm.$nextTick(() => parse(el))
  }
}
export default styleDirective

function parse(el) {
  const ids = Object.keys(el.dataset)
  const css = el.innerText
  const cssBlocks = css.match(/[^\}]+\{[^\}|.]+\}/g)

  const parsedCssBlocks = cssBlocks.reduce((acc, cssBlock) => {
    const klasses = cssBlock.match(/.+(?=\{)/g)[0].split(',')

    const parsedKlasses = klasses
      .reduce((acc, klass) => {
        const stringIds = ids.reduce((acc, id) => {
          acc += `[data-${id.kebabCase()}]`
          return acc
        }, '')

        acc.push(stringIds + klass.trim())
        return acc
      }, [])
      .join(',')

    const styles = cssBlock.match(/[\S|^\{|^\}]+:[\w|%]+/g)[0]
    const inlineStyle = styles.match(/([\w-]*)\s*:\s*([^;]*)/g)

    const parsedStyles = inlineStyle.reduce((acc, style) => {
      const [attr, value] = style.split(':')
      acc[normalize(camelCase(attr))] = value
      return acc
    }, {})

    acc += `${parsedKlasses} {${objToString(parsedStyles)}}\n`
    return acc
  }, '')

  if (el && window[FREE_STYLE][el]) {
    window[FREE_STYLE][el].textContent = parsedCssBlocks
    return
  }

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  el.style.block = 'none'
  head.appendChild(style)

  window[FREE_STYLE][el] = style

  style.type = 'text/css'
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = parse(parsedCssBlocks)
  } else {
    style.appendChild(document.createTextNode(parsedCssBlocks))
  }
}

function objToString(styleObj) {
  if (!styleObj || typeof styleObj !== 'object' || Array.isArray(styleObj)) {
    throw new TypeError(
      `expected an argument of type object, but got ${typeof styleObj}`
    )
  }
  const lines = Object.keys(styleObj).map(
    property => `\n  ${kebabCase(property)}: ${styleObj[property]};\n`
  )
  return lines.join('\n')
}
