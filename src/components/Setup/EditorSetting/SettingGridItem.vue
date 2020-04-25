<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { select, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  isDraggable: true,
  isResizable: true,
  static: false
}

const options = [
  { label: 'Follow Parent', value: null },
  { label: 'YES', value: true },
  { label: 'NO', value: false }
]

export default {
  name: 'SettingGridItem',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          select('isDraggable', { options }),
          select('isResizable', { options }),
          select('static', { options })
        ],
        defaultSetting
      )
    }
  }
}
</script>
