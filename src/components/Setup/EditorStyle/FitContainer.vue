<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="3">
      <el-checkbox v-model="autoResize" />
    </el-col>

    <el-col
      :span="21"
      class="title"
    >
      Auto resize height to fit container
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { vmGet } from '@/utils/vmMap'
import { getValueByPath } from '@/utils/tool'
import { STYLES } from '@/const'
import { arrayLast } from '@/utils/array'

export default {
  name: 'FitContainer',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    autoResize: {
      get() {
        const node = arrayLast(this.selectedComponentNodes)
        if (!node) return ''
        const vm = vmGet(node.id)
        return getValueByPath(vm, ['innerStyles', 'layout', 'autoResize'], '')
      },
      set(value) {
        this.recordStyles({ autoResize: value || undefined })
      }
    }
  },
  methods: {
    ...mapActions('node', ['record']),
    recordStyles(object) {
      const records = []

      for (const key in object) {
        const value = object[key]

        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: [node.id, STYLES, 'layout', key],
            value
          })
        })
      }

      this.record(records)
    }
  }
}
</script>

<style scoped lang="scss"></style>
