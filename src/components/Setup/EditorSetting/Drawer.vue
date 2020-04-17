<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import { pxPercent } from './utils/validation'
import SettingGenerator from './Common/SettingGenerator'
import {
  boolean,
  select,
  string,
  assignDefaultValue
} from './utils/util'

const APPEND_TO_BODY = 'appendToBody'
const MODAL_APPEND_TO_BODY = 'modal-append-to-body'
const CLOSE_ON_PRESS_ESCAPE = 'close-on-press-escape'
const SHOW_CLOSE = 'show-close'
const MODAL = 'modal'
const DIRECTION = 'direction'
const SIZE = 'size'

export const defaultSetting = {
  [APPEND_TO_BODY]: true,
  [MODAL_APPEND_TO_BODY]: true,
  [CLOSE_ON_PRESS_ESCAPE]: false,
  [SHOW_CLOSE]: false,
  [MODAL]: false,
  [DIRECTION]: 'ltr',
  [SIZE]: '30%'
}

export default {
  name: 'Drawer',
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
          boolean(APPEND_TO_BODY),
          boolean(MODAL_APPEND_TO_BODY),
          boolean(CLOSE_ON_PRESS_ESCAPE),
          boolean(SHOW_CLOSE),
          boolean([MODAL]),
          string(SIZE, { validate: [pxPercent] }),
          select(DIRECTION, {
            options: ['ltr', 'rtl', 'ttb', 'btt']
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
