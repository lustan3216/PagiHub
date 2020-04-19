import { Mark } from 'tiptap'
import { updateMark, markInputRule } from 'tiptap-commands'

export default class FontBackgroundColor extends Mark {
  get name() {
    return 'fontBackgroundColor'
  }

  get schema() {
    return {
      attrs: {
        fontBackgroundColor: {
          default: null
        }
      },
      parseDOM: [{
        style: 'background-color',
        getAttrs: mark => (mark.indexOf('rgb') !== -1 ? { fontBackgroundColor: mark } : '')
      }],
      toDOM: mark => ['span', { style: `background-color: ${mark.attrs.fontBackgroundColor}` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.fontSize) {
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
