<template>
  <grid-generator-inner
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :inner-styles="innerStyles"
    :class="{ 'cross-hair': isAdding }"
    :extra-style="{
      minHeight: '100%'
    }"
    controller
    data-image-droppable
    class="background over-hidden"
  />
</template>

<script>
import { mapState } from 'vuex'
import toolMixin from '@/components/Templates/mixins/tool'
import propsMixin from '@/components/Templates/mixins/props'
// childrenMixin 要拿來新增刪除小孩的
import childrenMixin from '@/components/Templates/mixins/children'
import GridGeneratorInner from './GridGeneratorInner'

export default {
  name: 'Background',
  components: {
    GridGeneratorInner
  },
  provide() {
    return {
      gridItemAutoSize: () => {},
      boundaryRect: {
        px: {
          w: 0,
          h: 0,
          x: 0,
          y: 0
        }
      }
    }
  },
  mixins: [toolMixin, propsMixin, childrenMixin],
  computed: {
    ...mapState('app', ['isAdding'])
  }
}
</script>

<style scoped lang="scss">
.background {
  min-height: 100%;
}
.cross-hair {
  cursor: crosshair !important;
}
</style>
