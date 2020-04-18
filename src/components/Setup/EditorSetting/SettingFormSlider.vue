<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, number, boolean } from './utils/util'
import form, {
  FIELD,
  SHOW_LABEL,
  DISABLED,
  SIZE,
  VALUE,
  MIN,
  MAX
} from './utils/form'

const STEP = 'step'
const PRECISION = 'precision'
const SHOW_INPUT = 'showInput'
const SHOW_INPUT_CONTROLS = 'showInputControls'
const SHOW_STOPS = 'showStops'
const SHOW_TOOL_TIP = 'showTooltip'
const RANGE = 'range'
const VERTICAL = 'vertical'

export const defaultSetting = {
  [FIELD]: 'formSlider',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 'mini',
  [MIN]: 0,
  [MAX]: 10,

  [STEP]: 1,
  [PRECISION]: 1,
  [SHOW_INPUT]: true,
  [SHOW_INPUT_CONTROLS]: true,
  [SHOW_STOPS]: false,
  [SHOW_TOOL_TIP]: true,
  [RANGE]: true,
  [VERTICAL]: false,
  [VALUE]: 0
}

export default {
  name: 'SettingFormSlider',
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
          form[FIELD],
          form[SHOW_LABEL],
          form[DISABLED],
          form[SIZE],
          form[MIN],
          form[MAX],
          number(STEP),
          number(PRECISION),
          boolean(SHOW_INPUT),
          boolean(SHOW_INPUT_CONTROLS),
          boolean(SHOW_STOPS),
          boolean(SHOW_TOOL_TIP),
          boolean(RANGE),
          boolean(VERTICAL),
          number(VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
