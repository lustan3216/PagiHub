import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, getValueByPath } from '@/utils/tool'
import { STYLE } from '@/const'

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
      nodes() {
        return this.selectedComponentNodes
      },
      allValues() {
        return this.nodes.map(node =>
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
      ...mapMutations('node', ['RECORD', 'SOFT_RECORD']),
      recordStyles(object) {
        const records = []

        for (const key in object) {
          const value = object[key]

          this.nodes.forEach(node => {
            records.push({
              path: `${node.id}.${STYLE}.${this.state}.${key}`,
              value
            })
          })
        }

        this.RECORD(records)
      },
      softRecordStyles(object) {
        const records = []

        for (const key in object) {
          const value = object[key]

          this.nodes.forEach(node => {
            records.push({
              path: `${node.id}.${STYLE}.${this.state}.${key}`,
              value
            })
          })
        }

        this.SOFT_RECORD(records)
      }
    }
  }
}
