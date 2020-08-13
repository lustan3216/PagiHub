import { Mark } from 'tiptap'
import { updateMark, markInputRule, removeMark } from 'tiptap-commands'

export default class FontFamily extends Mark {
  get name() {
    return 'textAlign'
  }

  get schema() {
    return {
      attrs: {
        textAlign: {
          default: null
        }
      },
      parseDOM: [{
        style: 'text-align',
        getAttrs: mark => ({ textAlign: mark })
      }],
      toDOM: mark => ['span', { style: `text-align: ${mark.attrs.textAlign}; display:block;` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.textAlign) {
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
