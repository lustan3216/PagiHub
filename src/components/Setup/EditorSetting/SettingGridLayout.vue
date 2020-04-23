<template>
  <setting-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { boolean, assignDefaultValue } from './utils/ruleTool'

const VERTICAL_COMPACT = 'verticalCompact'
const BREAK_POINT = 'breakPoint'
const LG = 'lg'
const MD = 'md'
const SM = 'sm'
const XS = 'xs'
const XXS = 'xxs'
// margin
// responsive
export const defaultSetting = {
  [VERTICAL_COMPACT]: false,
  [BREAK_POINT]: {
    [LG]: 1200,
    [MD]: 996,
    [SM]: 75,
    [XS]: 24,
    [XXS]: 12
  }
}

export default {
  name: 'SettingGridLayout',
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
          boolean(VERTICAL_COMPACT)

          // number(LG, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          // number(MD, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          // number(SM, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          // number(XS, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          // number(XXS, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }})
        ],
        defaultSetting
      )
    }
  }
}
</script>
