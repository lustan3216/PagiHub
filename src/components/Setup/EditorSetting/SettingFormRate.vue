<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { assignDefaultValue, number, boolean, colorAlpha, selectCreate } from './utils/util'
import form, { FIELD, SHOW_LABEL, DISABLED, VALUE, MAX } from './utils/form'

const LOW_THRESHOLD = 'lowThreshold'
const HIGH_THRESHOLD = 'highThreshold'
const ALLOW_HALF = 'allowHalf'

const LOW_COLOR = 'lowColor'
const MID_COLOR = 'midColor'
const HIGH_COLOR = 'highColor'

const VOID_COLOR = 'voidColor'
const DISABLED_VOIDCOLOR = 'disabledVoidColor'

const SHOW_TEXT = 'showText'
const TEXT_COLOR = 'textColor'
const SHOW_SCORE = 'showScore'
const TEXTS = 'texts'

export const defaultSetting = {
  [FIELD]: 'formRate',
  [SHOW_LABEL]: true,
  [DISABLED]: false,
  [MAX]: 5,
  [LOW_THRESHOLD]: 1,
  [HIGH_THRESHOLD]: 1,
  [ALLOW_HALF]: true,
  [LOW_COLOR]: '#F7BA2A',
  [MID_COLOR]: '#F7BA2A',
  [HIGH_COLOR]: '#F7BA2A',

  [VOID_COLOR]: '#C6D1DE',
  [DISABLED_VOIDCOLOR]: '#EFF2F7',

  [SHOW_TEXT]: true,
  [TEXT_COLOR]: '#1F2D3D',
  [SHOW_SCORE]: false,
  [TEXTS]: ['极差', '失望', '一般', '满意', '惊喜'],
  [VALUE]: 0
}

export default {
  name: 'SettingFormRate',
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
          form[MAX],
          number(LOW_THRESHOLD),
          number(HIGH_THRESHOLD),
          boolean(ALLOW_HALF),
          colorAlpha(LOW_COLOR),
          colorAlpha(MID_COLOR),
          colorAlpha(HIGH_COLOR),
          colorAlpha(VOID_COLOR),
          colorAlpha(DISABLED_VOIDCOLOR),
          boolean(SHOW_TEXT),
          colorAlpha(TEXT_COLOR),
          boolean(SHOW_SCORE),
          selectCreate(TEXTS)
        ],
        defaultSetting
      )
    }
  }
}
</script>
