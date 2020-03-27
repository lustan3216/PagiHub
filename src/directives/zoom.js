import mousewheel from 'element-ui/lib/directives/mousewheel'
import { isFunction } from 'element-ui/lib/utils/types'

let scale = 1

export default {
  bind: function(el, binding) {
    const { min = 0.5, max = 1.25 } = binding.value || {}

    mousewheel.bind(el, {
      value: function(event, { pixelX, pixelY }) {
        if (event.ctrlKey) {

          event.preventDefault()

          scale += pixelY * -0.005

          // Restrict scale
          scale = Math.min(Math.max(min, scale), max)
          isFunction(binding.value) && binding.value(scale)
        }
      }
    })
  }
}
