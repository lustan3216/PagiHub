<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { boolean, assignDefaultValue } from './utils/ruleTool'

export const defaultSetting = {
  userCanDrag: false,
  userCanResize: false
  // static: false,
}

export default {
  name: 'SettingGridGeneratorItem',
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
          boolean('userCanDrag', {
            info: 'Allow client user play with dragging when published.'
          }),
          boolean('userCanResize', {
            info: 'Allow client user play with resizing when published.'
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
