import { mapMutations, mapGetters } from 'vuex'
import { arrayLast, toArray } from '@/utils/array'
import { getValueByPath } from '@/utils/tool'
import { vmGet } from '@/utils/vmMap'
import { HTML, STYLES } from '@/const'

export default function(attrs) {
  const computedAttrs = {}

  toArray(attrs).forEach(attr => {
    computedAttrs[attr] = {
      get() {
        const node = arrayLast(this.selectedComponentNodes)
        if (node) {
          const vm = vmGet(node.id, this.isExample)
          return getValueByPath(vm, ['innerStyles', HTML, attr], '')
        }
        else {
          return ''
        }
      },
      set(value) {
        this.recordStyles({ [attr]: value || undefined })
      }
    }
  })

  return {
    computed: {
      ...mapGetters('app', ['selectedComponentNodes']),
      ...computedAttrs
    },
    methods: {
      ...mapMutations('node', ['RECORD']),
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

        this.RECORD(records)
      }
    }
  }
}
