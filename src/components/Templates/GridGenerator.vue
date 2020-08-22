<template>
  <grid-generator-inner
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
import GridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingGridGenerator'

export default {
  defaultSetting,
  name: 'GridGenerator',
  components: {
    GridGeneratorInner,
    ControllerLayer
  },
  mixins: [nodeMixin, childrenMixin]
}
</script>
