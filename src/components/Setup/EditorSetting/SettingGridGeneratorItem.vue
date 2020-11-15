<template>
  <div>
    <p class="font-12 gray-font-2 m-b-5">
      Allow client user interact with items on the published page.
    </p>

    <rules-generator
      :id="id"
      :rules="spec"
    />
  </div>
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
          boolean('userCanDrag', { title: 'Draggable' }),
          boolean('userCanResize', { title: 'Resizable' })
        ],
        defaultSetting
      )
    }
  }
}
</script>
