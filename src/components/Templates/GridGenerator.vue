<template>
  <grid-generator-inner
    :id="id"
    :inner-props="innerProps"
    :inner-style="innerStyles"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import GridGeneratorInner from './GridGeneratorInner'
import { defaultSetting } from '../Setup/EditorSetting/SettingGridGenerator'

export default {
  defaultSetting,
  name: 'GridGenerator',
  components: {
    GridGeneratorInner
  },
  mixins: [nodeMixin]
}
</script>

<style lang="scss" scoped>
/* grid layout has performance issue when using border and border-radius */
.editable {
  & > div > .vue-grid-layout {
    border: none;
  }
}

::v-deep.editable .vue-resizable-handle {
  z-index: 10;
}
</style>
