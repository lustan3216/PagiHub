import { number, boolean } from './util'
export default function() {
  return {
    basic: {
      'col-num': number('col-num', { value: 68 }),
      'row-height': number('row-height', { value: 3 }),
      'vertical-compact': boolean('vertical-compact', { value: true })
    }
  }
}
