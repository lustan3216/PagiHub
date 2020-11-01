<template>
  <!--  v-if="isGridItemParent"-->
  <grid-generator-inner
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :inner-styles="innerStyles"
    :controller="controller"
    data-node
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
import nodeMixin from '@/components/Templates/mixins/node'
// childrenMixin 要拿來新增刪除小孩的
import childrenMixin from '@/components/Templates/mixins/children'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import GridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingGridGenerator'

export default {
  defaultSetting,
  name: 'GridGenerator',
  components: {
    GridGeneratorInner,
    ControllerLayer
  },
  mixins: [nodeMixin, childrenMixin],
  props: {
    controller: {
      type: Boolean,
      default: false
    }
  }
}
</script>
