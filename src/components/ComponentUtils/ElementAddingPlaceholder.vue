<template>
  <grid-item
    v-bind="item"
  >
    <portal to="ElementPlaceholder">
      <div
        ref="handler"
        :style="style"
      />
    </portal>
  </grid-item>
</template>

<script>
import { mapState } from 'vuex'
import GridItem from '@/vendor/vue-grid-layout/components/GridItem'
import interact from 'interactjs'
import { asyncGetValue } from '@/utils/tool'

export default {
  name: 'ElementAddingPlaceholder',
  components: {
    GridItem
  },
  data() {
    return {
      item: {
        i: -1,
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        stack: true,
        unitH: 'px',
        unitW: 'px',
        unitX: 'px',
        unitY: 'px'
      }
    }
  },
  computed: {
    ...mapState('layout', ['scaleRatio']),
    style() {
      const { x, y, w, h } = this.item

      return {
        transform: `translate(${Math.round(x / this.scaleRatio)}px, ${Math.round(y / this.scaleRatio)}px)`,
        width: Math.round(w / this.scaleRatio) + 'px',
        height: Math.round(h / this.scaleRatio) + 'px',
        border: '1px dashed blue',
        background: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        zIndex: 111,
        top: 0
      }
    }
  },
  watch: {
    item: {
      handler(value) {
        this.$emit('input', value)
      },
      immediate: true
    }
  },
  async mounted() {
    this.$bus.$on('asdd', (rect) => {
      const parentRect = this.$parent.$el.getBoundingClientRect()
      this.item.x = parentRect.x - rect.x
      this.item.y = parentRect.y - rect.y
      this.item.w = rect.width
      this.item.h = rect.height
    })

    const node = await asyncGetValue(() => this.$refs.handler)
    this.interactObj = interact(node)
    this.interactObj.draggable({})

    if (!this.dragEventSet) {
      this.dragEventSet = true
      this.interactObj.on('dragstart dragmove dragend', event => {
        requestAnimationFrame(() => {
          switch (event.type) {
            case 'dragstart':
              this.$emit('move-start')
              break
            case 'dragmove':
              this.$emit('move')
              break
            case 'dragend':
              this.$emit('moved')
              break
          }
          this.$bus.$emit(`handleDrag-${this.item.i}`, event)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
