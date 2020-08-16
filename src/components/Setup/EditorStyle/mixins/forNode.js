import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, getValueByPath } from '@/utils/tool'
import { recordStyles, softRecordStyles } from '../utils/record'

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
          this.recordStyles(this.nodes, { [attr]: value || undefined })
        }
      }
    },
    methods: {
      ...mapMutations('component', ['RECORD', 'SOFT_RECORD']),
      recordStyles,
      softRecordStyles
    }
  }
}
