import { Mark } from 'tiptap'
import { updateMark, markInputRule, removeMark } from 'tiptap-commands'

export default class LineHeight extends Mark {
  get name() {
    return 'lineHeight'
  }

  get schema() {
    return {
      attrs: {
        lineHeight: {
          default: null
        }
      },
      parseDOM: [{
        style: 'line-height',
        getAttrs: mark => ({ lineHeight: mark })
      }],
      toDOM: mark => ['span', { style: `line-height: ${mark.attrs.lineHeight}` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.lineHeight) {
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
