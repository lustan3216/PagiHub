<template>
<!--  <rules-generator-->
<!--    :id="id"-->
<!--    :rules="spec"-->
<!--  />-->
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { select, boolean, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  // isDraggable: true,
  // isResizable: true,
  // static: false,
  // autoHeight: false,
}

const options = [
  { label: 'Follow Parent', value: null },
  { label: 'YES', value: true },
  { label: 'NO', value: false }
]

export default {
  name: 'SettingGridItem',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          // select('isDraggable', { options }),
          // select('isResizable', { options }),
          // select('static', { options }),
          // boolean('autoHeight')
        ],
        defaultSetting
      )
    }
  }
}
</script>
