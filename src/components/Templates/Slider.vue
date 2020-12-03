<template>
  <grid-generator-inner
    v-if="node"
    ref="grid"
    :width.sync="px.w"
    :height.sync="px.h"
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :inner-styles="innerStyles"
    :extendable-height="false"
    :boundary-capping="false"
    controller
  />
</template>

<script>
import toolMixin from '@/components/Templates/mixins/tool'
import propsMixin from '@/components/Templates/mixins/props'
import childrenMixin from '@/components/Templates/mixins/children'
import GridGeneratorInner from './GridGeneratorInner'
import { mapState } from 'vuex'

export default {
  name: 'Slider',
  components: {
    GridGeneratorInner
  },
  provide() {
    return {
      gridItemAutoSize: () => {},
      boundaryRect: {
        px: this.px
      }
    }
  },
  // childrenMixin 要拿來新增刪除小孩的
  mixins: [propsMixin, childrenMixin, toolMixin],
  data() {
    return {
      px: {
        w: 0,
        h: 0,
        x: 0,
        y: 0
      }
    }
  }
}
</script>
