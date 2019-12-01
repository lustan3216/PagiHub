import { pxPercent } from './validation'
import { boolean, select, string } from './util'
export default function() {
  return {
    basic: {
      'append-to-body': boolean('append-to-body'),
      'close-on-press-escape': boolean('close-on-press-escape'),
      'show-close': boolean('show-close'),
      modal: boolean('modal'),
      direction: select('direction', { options: ['rtl', 'ltr', 'ttb', 'btt'] }),
      size: string('size', { value: '30%', validate: [pxPercent] })
    }
  }
}
