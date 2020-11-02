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
    @height-updated="heightUpdated"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
    ...mapState('app', ['isAdding']),
    ...mapState('layout', ['windowWidth']),
    percentUnitW() {
      // for @/utils/layout unitConvert only
      return this.windowWidth / 100
    }
  },
  methods: {
    ...mapMutations('layout', { LAYOUT_SET: 'SET' }),
    heightUpdated(height) {
      this.LAYOUT_SET({
        backgroundHeight: parseInt(height)
      })
    }
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
