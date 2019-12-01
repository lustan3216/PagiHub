import { select } from './util'

export default function() {
  return {
    basic: {
      shadow: select('shadow', { options: ['always', 'hover', 'never'] })
    }
  }
}
