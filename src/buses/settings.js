import { bus } from '../main'

const KEY = 'settingChange'

export function emitSettingChange(id, { styles, classes }) {
  bus.$emit(`${KEY}:${id}`, {
    styles,
    classes
  })
}

export function onSettingChange(id, fn) {
  bus.$on(`${KEY}:${id}`, fn)
}
