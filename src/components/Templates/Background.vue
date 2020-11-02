<template>
  <!--  v-if="isGridItemParent"-->
  <grid-generator-inner
    :style="innerStyles.html"
    :id="id"
    :inner-props="innerProps"
    :inner-styles="innerStyles"
    :class="{ 'cross-hair': isAdding }"
    controller
    class="background"
  />
</template>

<script>
import { mapState } from 'vuex'
import toolMixin from '@/components/Templates/mixins/tool'
import propsMixin from '@/components/Templates/mixins/props'
// childrenMixin 要拿來新增刪除小孩的
import childrenMixin from '@/components/Templates/mixins/children'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import GridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingGridGenerator'

export default {
  defaultSetting,
  name: 'Background',
  components: {
    GridGeneratorInner,
    ControllerLayer
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
