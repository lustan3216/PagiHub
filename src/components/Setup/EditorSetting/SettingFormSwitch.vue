<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, colorAlpha, string } from './utils/ruleTool'
import form, { FIELD, SHOW_LABEL, DISABLED, SIZE, VALUE } from './utils/form'

const ACTIVE_COLOR = 'activeColor'
const INACTIVE_COLOR = 'inactiveColor'
const ACTIVE_TEXT = 'activeText'
const INACTIVE_TEXT = 'inactiveText'

export const defaultSetting = {
  [FIELD]: 'formSlider',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [SIZE]: 'mini',

  [ACTIVE_COLOR]: '#409EFF',
  [INACTIVE_COLOR]: '#C0CCDA',

  [ACTIVE_TEXT]: 'activeText',
  [INACTIVE_TEXT]: 'inactiveText',
  [VALUE]: true
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
          colorAlpha(ACTIVE_COLOR),
          colorAlpha(INACTIVE_COLOR),
          string(ACTIVE_TEXT),
          string(INACTIVE_TEXT)
        ],
        defaultSetting
      )
    }
  }
}
</script>
