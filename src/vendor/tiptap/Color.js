import { Mark } from 'tiptap'
import { updateMark, markInputRule, removeMark } from 'tiptap-commands'

export default class Color extends Mark {
  get name() {
    return 'color'
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: null
        }
      },
      parseDOM: [
        {
          style: 'color',
          getAttrs: mark => ({ color: mark })
        }
      ],
      toDOM: mark => ['span', { style: `color: ${mark.attrs.color}` }, 0]
    }
  }

  commands({ type }) {
    return attrs => {
      if (attrs.color) {
        return updateMark(type, attrs)
      }

      return removeMark(type)
    }
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)]
  }
}
