import { mapActions, mapGetters } from 'vuex'
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { HTML, STYLES } from '@/const'

export default function(attr) {
  return {
    computed: {
      ...mapGetters('app', ['selectedComponentNodes']),
      lastNode() {
        return arrayLast(this.selectedComponentNodes)
      },
      [attr]: {
        get() {
          return getValueByPath(this.lastNode, [STYLES, HTML, attr], '')
        },
        set(value) {
          this.recordStyles({ [attr]: value || undefined })
        }
      }
    },
    methods: {
      ...mapActions('node', ['debounceRecord']),
      recordStyles(object) {
        const records = []

        for (const key in object) {
          const value = object[key]

          this.selectedComponentNodes.forEach(node => {
            records.push({
              path: [node.id, STYLES, HTML, key],
              value
            })
          })
        }

        this.debounceRecord(records)
      }
    }
  }
}
