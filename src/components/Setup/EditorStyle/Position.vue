<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="8">
      <span class="title p-r-10">Position</span>
    </el-col>

    <el-col :span="16">
      <el-select v-model="position">
        <el-option
          label="Default"
          value=""
        />
        <el-option
          label="Fix when parent scrolling"
          value="fixed"
        />
        <el-option
          label="Fix on parent's bottom"
          value="fixOnParentBottom"
        />
        <el-option
          label="Stick to top"
          value="verticalCompact"
        />
      </el-select>
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
  name: 'Position',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    allValues() {
      return this.selectedComponentNodes.map(node => {
        const vm = vmGet(node.id, this.isExample)
        return getValueByPath(vm, ['innerStyles', 'layout', 'position'], '')
      })
    },
    position: {
      get() {
        const node = arrayLast(this.selectedComponentNodes)
        const vm = vmGet(node.id, this.isExample)
        return getValueByPath(vm, ['innerStyles', 'layout', 'position'], '')
      },
      set(value) {
        this.recordStyles({ position: value || undefined })
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
