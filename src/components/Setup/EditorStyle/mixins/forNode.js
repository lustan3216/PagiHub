import { mapMutations, mapGetters } from 'vuex'
import { arrayLast } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'
import { HTML, STYLES } from '@/const'

export default function(attr) {
  return {
    computed: {
      ...mapGetters('app', ['selectedComponentNodes']),
      nodes() {
        return this.selectedComponentNodes
      },
      allValues() {
        return this.nodes.map(node => {
          const vm = vmGet(node.id, this.isExample)
          return getValueByPath(vm, ['innerStyles', HTML, attr], '')
        })
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
              path: [node.id, STYLES, HTML, key],
              value
            })
          })
        }

        this.RECORD(records)
      }
    }
  }
}
