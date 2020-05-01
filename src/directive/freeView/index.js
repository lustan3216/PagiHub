import normalizeWheel from 'normalize-wheel'
import { requestAnimationFrame } from 'raf-plus'
import { isFirefox, movable, scalable, assignStyle } from './util'
import { on } from '@/utils/tool'

export const cached = {}
const CACHE_ID = '@@freeView'
const eventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export const directive = {
  bind(element, bind) {
    freeView(element, bind.value)
  }
}

export default function freeView(baseElement, options) {
  if (options === false) {
    return
  }

  const {
    scale = true,
    move = true,
    minRatio = 0.3,
    maxRatio = 2,
    moveCallback = null,
    scaleCallback = null,
    targetSelector = null,
    moveIgnoreSelector = null,
    scaleIgnoreSelector = null,
    startCallback = null,
    endCallback = null
  } = options

  if (!baseElement || baseElement[CACHE_ID]) {
    return
  }

  baseElement[CACHE_ID] = baseElement[CACHE_ID] || Math.random() * +new Date()
  const id = baseElement[CACHE_ID]

  cached[id] = {
    baseElement,
    scale,
    move,
    x: 0,
    y: 0,
    scaleRatio: 1,
    targetSelector,
    moveIgnoreSelector,
    scaleIgnoreSelector
  }

  const self = cached[id]

  on(baseElement, eventName, function(event) {
    if (startCallback) {
      startCallback(event, self)
    }

    const canScale = scalable(self, event)
    const canMove = movable(self, event)

    if (canScale || canMove) {
      event.preventDefault()
      event.stopPropagation()
    }

    requestAnimationFrame(() => {
      const normalized = normalizeWheel(event)

      if (canScale) {
        self.scaleRatio = self.scaleRatio + normalized.pixelY * -0.008
        self.scaleRatio = Math.min(
          Math.max(minRatio, self.scaleRatio),
          maxRatio
        )

        assignStyle(self)

        if (scaleCallback) {
          scaleCallback(event, self)
        }
      } else if (canMove) {
        self.x = self.x - normalized.pixelX
        self.y = self.y - normalized.pixelY

        assignStyle(self)

        if (moveCallback) {
          moveCallback(event, self)
        }
      }
    })

    if (endCallback) {
      endCallback(event, self)
    }
  })
}
