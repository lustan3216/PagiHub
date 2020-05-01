export function isFirefox() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  )
}

export function movable({ move, moveIgnoreSelector }, { target, ctrlKey }) {
  if (!ctrlKey && move) {
    if (moveIgnoreSelector) {
      const els = document.querySelectorAll(moveIgnoreSelector)

      if (els.length) {
        return !Array.from(els).find(x => x.contains(target))
      } else {
        return true
      }
    } else {
      return true
    }
  }
}

export function scalable({ scale, scaleIgnoreSelector }, { target, ctrlKey }) {
  if (ctrlKey && scale) {
    if (scaleIgnoreSelector) {
      const els = document.querySelectorAll(scaleIgnoreSelector)
      if (els.length) {
        return !Array.from(els).find(x => x.contains(target))
      } else {
        return true
      }
    } else {
      return true
    }
  }
}

export function assignStyle({ targetSelector, baseElement, x, y, scaleRatio }) {
  const target = targetSelector
    ? document.querySelector(targetSelector)
    : baseElement

  if (target) {
    const transform = `scale(${scaleRatio.toFixed(
      3
    )}) translate(${x}px, ${y}px)`
    target.style.webkitTransform = target.style.transform = transform
  } else {
    console.warn('Can not find the target')
  }
}
