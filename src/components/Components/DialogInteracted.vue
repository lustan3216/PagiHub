<template>
  <!-- fake-transform 是為了讓裡面的position: fixed 保持一致，不然一開始沒有的話，position: fixed會跑去body底下 -->
  <div
    :style="{ 'z-index': zIndex }"
    class="fake-transform"
  >
    <slot />
  </div>
</template>

<script>
import interactjs from 'interactjs'

export default {
  name: 'DialogInteracted',
  props: {
    zIndex: {
      type: Number,
      default: 100
    },
    visible: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: true
    },
    resizeOptions: {
      type: Object,
      default: () => ({})
    },
    dragOptions: {
      type: Object,
      default: () => ({})
    },
    resizable: {
      type: Boolean,
      default: true
    },
    resizeEdges: {
      type: Object,
      default() {
        return { left: true, right: true, bottom: true, top: true }
      }
    },
    scaleRatio: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    const interact = interactjs(this.$el)
    const edges = this.resizeEdges

    if (this.resizable) {
      interact
        .resizable({
          // resize from all edges and corners
          edges: this.resizeEdges,
          listeners: {
            move: event => {
              var target = event.target
              if (edges.left && edges.right) {
                target.style.width = event.rect.width / this.scaleRatio + 'px'
              }

              if (edges.top && edges.bottom) {
                target.style.height = event.rect.height / this.scaleRatio + 'px'
              }

              let { x, y } = event.target.dataset

              x = parseFloat(x) || 0
              y = parseFloat(y) || 0
              x += event.deltaRect.left / this.scaleRatio
              y += event.deltaRect.top / this.scaleRatio

              target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`

              target.setAttribute('data-x', x)
              target.setAttribute('data-y', y)

              this.$emit('resize', event)
            }
          },
          modifiers: [
            // keep the edges inside the parent
            interactjs.modifiers.restrictEdges({
              // outer: 'parent'
            }),

            // minimum size
            interactjs.modifiers.restrictSize({
              min: { width: 100, height: 50 }
            })
          ],

          inertia: true,
          ...this.resizeOptions
        })
        .on(['resizeend'], () => this.$emit('resizeEnd'))
        .on(['resizestart'], () => this.$emit('resizeStart'))

      // interactjs(this.$el)
    }

    if (this.draggable) {
      interact
        .draggable({
          listeners: {
            move: event => {
              const target = event.target
              let { x, y } = event.target.dataset
              x = (parseFloat(x) || 0) + event.dx
              y = (parseFloat(y) || 0) + event.dy

              const translate = `translate(${x}px, ${y}px)`
              target.style.webkitTransform = target.style.transform = translate

              target.setAttribute('data-x', x)
              target.setAttribute('data-y', y)

              this.$emit('drag', event)
            }
          },
          inertia: true,
          modifiers: [
            interactjs.modifiers.restrictRect({
              // restriction: 'parent',
              endOnly: true
            })
          ],
          ...this.dragOptions
        })
        .on(['dragstart'], () => this.$emit('dragStart'))
        .on(['dragend'], () => this.$emit('dragEnd'))
    }
  },
  methods: {
    reset() {
      this.$el.style.transform = null
      this.$el.setAttribute('data-x', 0)
      this.$el.setAttribute('data-y', 0)
    }
  }
}
</script>
