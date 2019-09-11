import clone from 'clone'
import { onSettingChange } from '../buses/settings'

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      required: true
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    styles: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      innerStyles: clone(this.styles)
    }
  },
  created() {
    if (this.isEditable) {
      onSettingChange(this.id, ({ styles }) => {
        this.innerStyles = styles
      })
    }
  }
}
