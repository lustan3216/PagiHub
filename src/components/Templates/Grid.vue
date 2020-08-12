<template>
  <grid-inner
    v-free-style="innerStyles"
    :id="id"
    :inner-props="innerProps"
  />
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
// childrenMixin 要拿來新增刪除小孩的
import childrenMixin from '@/components/Templates/mixins/children'
import ControllerLayer from '../TemplateUtils/ControllerLayer'
import GridInner from './GridInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingGridGenerator'

export default {
  defaultSetting,
  name: 'Grid',
  components: {
    GridInner,
    ControllerLayer
  },
  mixins: [nodeMixin, childrenMixin]
}
</script>

<style lang="scss" scoped>
::v-deep.editable .vue-resizable-handle {
  z-index: 10;
}
</style>
