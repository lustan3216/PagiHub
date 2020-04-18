<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { number, boolean, assignDefaultValue } from './utils/util'
import { PATH } from '../../../const'

const COL_NUM = 'colNum'
const ROW_HEIGHT = 'rowHeight'
const VERTICAL_COMPACT = 'verticalCompact'
const BREAK_POINT = 'breakPoint'
const COLS = 'COLS'
const LG = 'lg'
const MD = 'md'
const SM = 'sm'
const XS = 'xs'
const XXS = 'xxs'

export const defaultSetting = {
  [COL_NUM]: 72,
  [ROW_HEIGHT]: 5,
  [VERTICAL_COMPACT]: true,
  [COLS]: {
    [LG]: 72,
    [MD]: 54,
    [SM]: 36,
    [XS]: 24,
    [XXS]: 12
  },
  [BREAK_POINT]: {
    [LG]: 1200,
    [MD]: 996,
    [SM]: 75,
    [XS]: 24,
    [XXS]: 12
  }
}

export default {
  name: 'SettingGridItem',
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
          number(COL_NUM, {
            props: { min: 12, step: 4 },
            emit: ['change']
          }),
          number(ROW_HEIGHT),
          boolean(VERTICAL_COMPACT),

          number(LG, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          number(MD, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          number(SM, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          number(XS, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }}),
          number(XXS, { [PATH]: BREAK_POINT, props: { min: 12, step: 4 }})
        ],
        defaultSetting
      )
    }
  }
}
</script>
