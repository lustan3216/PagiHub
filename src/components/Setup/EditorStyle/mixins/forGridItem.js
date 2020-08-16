import { STYLE } from '@/const'
import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, getValueByPath } from '@/utils/tool'
import { isGridItem } from '@/utils/node'

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
      selectedGridItemNodes() {
        const nodes = []
        this.selectedComponentNodes.filter(node => {
          if (isGridItem(node)) {
            nodes.push(node)
          } else if (isGridItem(node.parentNode)) {
            nodes.push(node.parentNode)
          }
        })

        return nodes
      },
      allValues() {
        return this.selectedGridItemNodes.map(node =>
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
      ...mapMutations('component', ['RECORD']),
      recordStyles(object) {
        const records = []

        for (const key in object) {
          const value = object[key]

          this.selectedGridItemNodes.forEach(node => {
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
