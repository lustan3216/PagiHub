import { Mark } from 'tiptap'
import { updateMark, markInputRule, removeMark } from 'tiptap-commands'

export default class LetterSpacing extends Mark {
  get name() {
    return 'letterSpacing'
  }

  get schema() {
    return {
      attrs: {
        letterSpacing: {
          default: null
        }
      },
      parseDOM: [{
        style: 'letter-spacing',
        getAttrs: mark => ({ letterSpacing: mark })
      }],
      toDOM: mark => ['span', { style: `letter-spacing: ${mark.attrs.letterSpacing}` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.letterSpacing) {
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
