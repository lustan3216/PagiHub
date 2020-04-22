<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, number, boolean, select } from './utils/ruleTool'
import form, {
  FIELD,
  SHOW_LABEL,
  DISABLED,
  MIN,
  MAX,
  SIZE,
  VALUE
} from './utils/form'

const STEP = 'step'
const PRECISION = 'precision'
const CONTROLS = 'controls'
const CONTROLS_POSITION = 'controlsPosition'

export const defaultSetting = {
  [FIELD]: 'formInputNumber',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 'mini',
  [MIN]: 0,
  [MAX]: 10,
  [STEP]: 1,
  [PRECISION]: 1,
  [CONTROLS]: true,
  [CONTROLS_POSITION]: 'right',
  [VALUE]: 10
}

export default {
  name: 'SettingFormNumber',
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
          boolean(CONTROLS),
          select(CONTROLS_POSITION, { options: ['right', 'left'] }),
          number(VALUE)
        ],
        defaultSetting
      )
    }
  }
}
</script>
