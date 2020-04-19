import { Mark } from 'tiptap'
import { updateMark, markInputRule, removeMark } from 'tiptap-commands'

export default class BackgroundColor extends Mark {
  get name() {
    return 'backgroundColor'
  }

  get schema() {
    return {
      attrs: {
        backgroundColor: {
          default: null
        }
      },
      parseDOM: [{
        style: 'background-color',
        getAttrs: mark => (mark.indexOf('rgb') !== -1 ? { backgroundColor: mark } : '')
      }],
      toDOM: mark => ['span', { style: `background-color: ${mark.attrs.backgroundColor}` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.backgroundColor) {
        return updateMark(type, attrs)
      }

      return removeMark(type)
    }
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)
    ]
  }
}
