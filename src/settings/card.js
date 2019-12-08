import { select } from './util'

const shadow = 'shadow'

export const defaultSetting = {
  [shadow]: 'always'
}

export default {
  [shadow]: select(shadow, {
    value: defaultSetting[shadow],
    options: ['always', 'hover', 'never']
  })
}
