import { STYLE } from '@/const'
import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, getValueByPath } from '@/utils/tool'

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
          this.assignStyles({ [attr]: value || undefined })
        }
      }
    },
    methods: {
      ...mapMutations('component', ['RECORD']),
      assignStyles(object) {
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
      }
    }
  }
}
