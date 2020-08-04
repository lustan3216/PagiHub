<template>
  <!-- fake-transform 是為了讓裡面的position: fixed 保持一致，不然一開始沒有的話，position: fixed會跑去body底下 -->
  <div
    :style="{ 'z-index': zIndex }"
    class="fake-transform relative"
  >
    <div
      v-if="resizeEdges.top"
      class="handler top"
    />
    <div
      v-if="resizeEdges.right"
      class="handler right"
    />
    <div
      v-if="resizeEdges.bottom"
      class="handler bottom"
    />
    <div
      v-if="resizeEdges.left"
      class="handler left"
    />

    <slot />
  </div>
</template>

<script>
import interactjs from 'interactjs'
import { mapState } from 'vuex'

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
    }
  },
  computed: {
    ...mapState('app', ['scaleRatio']),
    interact() {
      return interactjs(this.$el)
    }
  },
  watch: {
    resizable(value) {
      this.interact.resizable(value)
    },
    draggable(value) {
      this.interact.draggable(value)
    }
  },
  mounted() {
    const edges = this.resizeEdges

    if (this.resizable) {
      this.interact
        .resizable({
          // resize from all edges and corners
          edges: this.resizeEdges,
          allowFrom:
            '.handler.top, .handler.bottom, .handler.right, .handler.left',
          listeners: {
            move: event => {
              const target = event.target

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
              outer: 'parent'
            }),

            // minimum size
            interactjs.modifiers.restrictSize({
              min: { width: 100, height: 50 }
            })
          ],

          inertia: true,
          ...this.resizeOptions
        })
        .on(['resizeend'], () => {
          this.$emit('resizeEnd')
        })
        .on(['resizestart'], () => {
          this.$emit('resizeStart')
        })
    }

    if (this.draggable) {
      this.interact
        .draggable({
          listeners: {
            move: event => {
              const target = event.target
              let { x, y } = event.target.dataset
              x = (parseFloat(x) || 0) + event.dx
              y = (parseFloat(y) || 0) + event.dy

              const transform = `translate(${x}px, ${y}px)`
              target.style.webkitTransform = target.style.transform = transform

              target.setAttribute('data-x', x)
              target.setAttribute('data-y', y)

              this.$emit('drag', event)
            }
          },
          inertia: true,
          modifiers: [
            interactjs.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true
            })
          ],
          ...this.dragOptions
        })
        .on(['dragstart'], () => {
          this.$emit('dragStart')
        })
        .on(['dragend'], () => {
          this.$emit('dragEnd')
        })
    }
  },
  methods: {
    reset() {
      this.$el.style.webkitTransform = this.$el.style.transform = null
      this.$el.setAttribute('data-x', 0)
      this.$el.setAttribute('data-y', 0)
    }
  }
}
</script>

<style scoped lang="scss">
.handler {
  position: absolute;
  border-radius: 7px;
  opacity: 0;
  transition: opacity 0.5s;
  &:hover {
    opacity: 1;
    background-color: rgba(169, 172, 179, 0.19);
  }
}
.top {
  top: -9px;
  left: 0;
  right: 0;
  height: 8px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.right {
  top: 0;
  bottom: 0;
  right: -9px;
  width: 8px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.bottom {
  left: 0;
  bottom: -9px;
  right: 0;
  height: 8px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}
.left {
  top: 0;
  left: -9px;
  bottom: 0;
  width: 8px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
