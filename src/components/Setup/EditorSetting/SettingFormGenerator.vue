<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { pxPercent } from './utils/validation'
import { boolean, select, string, assignDefaultValue } from './utils/util'
import { PATH } from '../../../const'

const INLINE = 'inline'
const LABEL_POSITION = 'labelPosition'
const HIDE_REQUIRED_ASTERISK = 'hideRequiredAsterisk'
const SHOW_MESSAGE = 'showMessage'
const INLINE_MESSAGE = 'inlineMessage'
const STATUS_ICON = 'statusIcon'
const LABEL_WIDTH = 'labelWidth'
const TYPE = 'type'

const FORM = 'form'
const INFO = 'info'

export const defaultSetting = {
  [FORM]: {
    [INLINE]: false,
    [LABEL_POSITION]: 'left',
    [HIDE_REQUIRED_ASTERISK]: true,
    [SHOW_MESSAGE]: true,
    [INLINE_MESSAGE]: true,
    [STATUS_ICON]: true,
    [LABEL_WIDTH]: '125px'
  },
  [INFO]: {
    [TYPE]: 'poptip'
  }
}

export default {
  name: 'SettingFormGenerator',
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
          boolean(INLINE, { [PATH]: FORM }),
          boolean(HIDE_REQUIRED_ASTERISK, { [PATH]: FORM }),
          boolean(SHOW_MESSAGE, { [PATH]: FORM }),
          boolean(STATUS_ICON, { [PATH]: FORM }),
          select(LABEL_POSITION, {
            [PATH]: FORM,
            options: ['left', 'right']
          }),

          select(TYPE, {
            [PATH]: INFO,
            options: ['poptip', 'tooltip']
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
