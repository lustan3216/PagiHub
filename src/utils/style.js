import { isUndefined } from '@/utils/tool'

export function setTransform({ top, left } = {}) {
  const translate = isUndefined(top) && isUndefined(left)
    ? null
    : `translate(${left || 0}px,${top || 0}px`

  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate
  }
}
