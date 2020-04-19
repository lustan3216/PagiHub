import { Mark } from 'tiptap'
import { updateMark, markInputRule } from 'tiptap-commands'

export default class FontTextColor extends Mark {
  get name() {
    return 'fontTextColor'
  }

  get schema() {
    return {
      attrs: {
        fontTextColor: {
          default: 'yellow'
        }
      },
      parseDOM: [
        {
          style: 'color',
          getAttrs: mark =>
            mark.indexOf('rgb') !== -1 ? { fontTextColor: mark } : ''
        }
      ],
      toDOM: mark => ['span', { style: `color: yellow` }, 0]
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
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)]
  }
}
