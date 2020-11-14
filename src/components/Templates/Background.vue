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
import { mapState, mapMutations } from 'vuex'
import toolMixin from '@/components/Templates/mixins/tool'
import propsMixin from '@/components/Templates/mixins/props'
// childrenMixin 要拿來新增刪除小孩的
import childrenMixin from '@/components/Templates/mixins/children'
import GridGeneratorInner from './GridGeneratorInner'
import { resizeListener } from '@/utils/tool'

export default {
  name: 'Background',
  components: {
    GridGeneratorInner
  },
  mixins: [toolMixin, propsMixin, childrenMixin],
  data() {
    return {
      offResizeListener: null
    }
  },
  computed: {
    ...mapState('app', ['isAdding'])
  },
  mounted() {
    this.offResizeListener = resizeListener(this.$el, () => {
      this.LAYOUT_SET({
        backgroundHeight: parseInt(this.$el.clientHeight)
      })
    })
  },
  beforeDestroy() {
    this.offResizeListener()
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' })
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
