import { isUndefined } from '@/utils/tool'

export function setTransform({ top, left } = {}) {
  const translate =
    isUndefined(top) && isUndefined(left)
      ? null
      : `translate(${left || 0}px,${top || 0}px)`

  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate
  }
}

export function getRectWithoutPadding(element) {
  const computedStyle = getComputedStyle(element)
  const { x, y } = element.getBoundingClientRect()

  let elementHeight = element.clientHeight // height with padding
  let elementWidth = element.clientWidth // width with padding

  elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
  elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
  return { height: elementHeight, width: elementWidth, x, y }
}

export function getAbsoluteHeight(el) {
  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el

  const styles = window.getComputedStyle(el)
  const margin = parseFloat(styles['paddingTop']) +
                 parseFloat(styles['paddingBottom'])

  return Math.ceil(el.offsetHeight + margin)
}
