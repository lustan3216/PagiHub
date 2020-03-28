<template>
  <div class="dialog">
    <slot />
  </div>
</template>

<script>
import interactjs from 'interactjs'

export default {
  name: 'DialogInteracted',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    interactjs(this.$el)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        cursorChecker: ({ edges }) => {
          const _ = '-resize'
          if (edges.left || edges.right) {
            return 'ew' + _
          } else {
            return 'ns' + _
          }
        },
        listeners: {
          move: event => {
            var target = event.target

            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'

            let x = parseFloat(target.getAttribute('data-x')) || 0
            let y = parseFloat(target.getAttribute('data-y')) || 0
            x += event.deltaRect.right
            y += event.deltaRect.top

            target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interactjs.modifiers.restrictEdges({
            outer: 'parent'
          }),

          // minimum size
          interactjs.modifiers.restrictSize({
            min: { width: 100, height: 50 }
          })
        ],

        inertia: true
      })
      .draggable({
        listeners: {
          move: event => {
            const target = event.target
            const x =
              (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            const y =
              (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

            const translate = `translate(${x}px, ${y}px)`
            target.style.webkitTransform = target.style.transform = translate

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
          }
        },
        inertia: true,
        modifiers: [
          interactjs.modifiers.restrictRect({
            // restriction: 'parent',
            endOnly: true
          })
        ]
      })
  }
}
</script>

<style scoped lang="scss">
.dialog {
  z-index: 100;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.87);
  box-shadow: 1px 1px 19px 6px rgba(0, 0, 0, 0.1);
}
</style>
