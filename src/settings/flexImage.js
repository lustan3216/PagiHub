import { select, string } from './util'

const src = 'src'
const fit = 'fit'
const placeholder = 'placeholder'
const error = 'error'

export const defaultSetting = {
  [src]: 'https://placeimg.com/1320/840/any',
  [fit]: 'cover',
  [placeholder]: 'placeholder',
  [error]: 'error'
}

export default {
  [fit]: select(fit, {
    value: defaultSetting[fit],
    options: ['fill', 'contain', 'cover', 'none', 'scale-down']
  }),
  [src]: string(src, {
    value: defaultSetting[src],
    validate: [{ type: 'url', message: '需選擇正確的網址' }]
  }),
  [placeholder]: string(placeholder, { value: defaultSetting[placeholder] }),
  [error]: string(error, { value: defaultSetting[error] })
}
