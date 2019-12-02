import { number, boolean } from './util'

const colNum = 'col-num'
const rowHeight = 'row-height'
const verticalCompact = 'vertical-compact'

export const defaultSetting = {
  [colNum]: 68,
  [rowHeight]: 3,
  [verticalCompact]: true
}

export default {
  [colNum]: number(colNum, { value: defaultSetting[colNum] }),
  [rowHeight]: number(rowHeight, { value: defaultSetting[rowHeight] }),
  [verticalCompact]: boolean(verticalCompact, {
    value: defaultSetting[verticalCompact]
  })
}
