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

export const defaultSetting = {
  showClose: true,
  modal: true,
  direction: 'ltr',
  size: '30%',
  toRoot: true
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
          boolean('toRoot'),
          boolean('showClose'),
          boolean('modal'),
          selectUnit('size', {
            validate: [pxPercent],
            props: { exclude: ['vw', 'vh'] }
          }),
          select('direction', {
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
