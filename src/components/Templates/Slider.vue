<template>
  <!--  v-if="isGridItemParent"-->
  <grid-generator-inner
    v-if="node"
    ref="grid"
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :inner-styles="innerStyles"
    :auto-extend-height="false"
    controller
  />
  <!--  <div-->
  <!--    v-else-->
  <!--    :style="innerStyles.default"-->
  <!--    class="h-100 no-action"-->
  <!--    @scroll.passive="onScroll"-->
  <!--  >-->
  <!--    <grid-generator-inner-->
  <!--      :id="id"-->
  <!--      :inner-props="innerProps"-->
  <!--      class="can-action"-->
  <!--    />-->
  <!--  </div>-->
</template>

<script>
import toolMixin from '@/components/Templates/mixins/tool'
import propsMixin from '@/components/Templates/mixins/props'
import childrenMixin from '@/components/Templates/mixins/children'
import GridGeneratorInner from './GridGeneratorInner'

export default {
  name: 'Slider',
  components: {
    GridGeneratorInner
  },
  // childrenMixin 要拿來新增刪除小孩的
  mixins: [propsMixin, childrenMixin, toolMixin]
}
</script>
