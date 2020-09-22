<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="3">
      <el-checkbox
        v-model="fixWhenScrolling"
      />
    </el-col>

    <el-col
      :span="16"
      class="title"
    >
      Fix position when scrolling
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { vmGet } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { arrayLast } from '@/utils/array'
import { isTextEditor } from '@/utils/node'

export default {
  name: 'FixWhenScrolling',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    nodes() {
      return this.selectedComponentNodes
    },
    allValues() {
      return this.nodes.map(node => {
        const vm = vmGet(node.id, this.isExample)
        return getValueByPath(
          vm,
          ['innerStyles', 'layout', 'fixWhenScrolling'],
          ''
        )
      })
    },
    fixWhenScrolling: {
      get() {
        return arrayLast(this.allValues) || ''
      },
      set(value) {
        this.recordStyles({ fixWhenScrolling: value || undefined })
      }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    recordStyles(object) {
      const records = []

      for (const key in object) {
        const value = object[key]

        this.nodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', key],
            value
          })
        })
      }

      this.RECORD(records)
    }
  }
}
</script>

<style scoped lang="scss"></style>
