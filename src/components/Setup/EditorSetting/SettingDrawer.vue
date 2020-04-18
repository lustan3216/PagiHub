<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import { pxPercent } from './utils/validation'
import SettingGenerator from './Common/SettingGenerator'
import { boolean, select, assignDefaultValue, selectUnit } from './utils/util'

const SHOW_CLOSE = 'showClose'
const MODAL = 'modal'
const DIRECTION = 'direction'
const SIZE = 'size'

export const defaultSetting = {
  [SHOW_CLOSE]: true,
  [MODAL]: true,
  [DIRECTION]: 'ltr',
  [SIZE]: '30%'
}

export default {
  name: 'SettingDrawer',
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
          boolean(SHOW_CLOSE),
          boolean(MODAL),
          selectUnit(SIZE, {
            validate: [pxPercent],
            props: { exclude: ['vw', 'vh'] }
          }),
          select(DIRECTION, {
            options: [
              { label: 'Left', value: 'ltr' },
              { label: 'Right', value: 'rtl' },
              { label: 'Top', value: 'ttb' },
              { label: 'Bottom', value: 'btt' }
            ]
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>

<style scoped>
::v-deep .el-input-group__append {
  text-align: center;
}
</style>
