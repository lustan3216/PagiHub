import { Mark } from 'tiptap'
import { updateMark, markInputRule } from 'tiptap-commands'

export default class FontFamily extends Mark {
  get name() {
    return 'fontFamily'
  }

  get schema() {
    return {
      attrs: {
        fontFamily: {
          default: 'arial'
        }
      },
      parseDOM: [{
        style: 'font-family',
        getAttrs: mark => ({ fontFamily: mark })
      }],
      toDOM: mark => ['span', { style: `font-family: ${mark.attrs.fontFamily}` }, 0]
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
