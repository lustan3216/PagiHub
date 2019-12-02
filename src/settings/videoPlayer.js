import { string, slider, boolean } from './util'

const src1 = 'src1'
const src2 = 'src2'
const poster = 'poster'
const volume = 'volume'
const autoplay = 'autoplay'
const controls = 'controls'
const muted = 'muted'
const loop = 'loop'

export const defaultSetting = {
  [src1]: '//www.youtube.com/watch?v=SlPhMPnQ58k',
  [src2]: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
  [poster]: 'https://placeimg.com/1320/840/any',
  [volume]: 1,
  [autoplay]: false,
  [controls]: true,
  [muted]: false,
  [loop]: true
}

export default {
  [src1]: string(src1, {
    value: defaultSetting[src1],
    validate: [{ type: 'url', message: '需選擇正確的網址' }]
  }),

  [src2]: string(src2, {
    value: defaultSetting[src2],
    validate: [{ type: 'url', message: '需選擇正確的網址' }]
  }),

  [poster]: string(poster, {
    value: defaultSetting[poster],
    validate: [{ type: 'url', message: '需選擇正確的網址' }]
  }),

  [autoplay]: boolean(autoplay, {
    value: defaultSetting[autoplay]
  }),

  [controls]: boolean(controls, {
    value: defaultSetting[controls]
  }),

  [muted]: boolean(muted, {
    value: defaultSetting[muted]
  }),

  [loop]: boolean(loop, {
    value: defaultSetting[loop]
  })
}
import 'video.js/dist/video-js.css'
