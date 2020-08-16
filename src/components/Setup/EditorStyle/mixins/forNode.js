import { STYLE } from '@/const'
import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, getValueByPath } from '@/utils/tool'
import { stringify } from '@/components/Setup/EditorStyle/utils/boxShadow'

export default function(attr) {
  return {
    props: {
      state: {
        type: String,
        default: 'default'
      }
    },
    computed: {
      ...mapGetters('app', ['selectedComponentNodes']),
      allValues() {
        return this.selectedComponentNodes.map(node =>
          getValueByPath(node, ['style', this.state, attr], '')
        )
      },
      [attr]: {
        get() {
          return arrayLast(this.allValues) || ''
        },
        set(value) {
          this.recordStyles({ [attr]: value || undefined })
        }
      }
    },
    methods: {
      ...mapMutations('component', ['RECORD', 'SOFT_RECORD']),
      recordStyles(object) {
        const records = []

        for (const key in object) {
          const value = object[key]

          this.selectedComponentNodes.forEach(node => {
            records.push({
              path: `${node.id}.${STYLE}.${this.state}.${key}`,
              value
            })
          })
        }

        this.RECORD(records)
      },
      softRecordStyles(value) {
        const records = []

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: `${node.id}.${STYLE}.${this.state}.${attr}`,
            value
          })
        })

        this.SOFT_RECORD(records)
      }
    }
  }
}
