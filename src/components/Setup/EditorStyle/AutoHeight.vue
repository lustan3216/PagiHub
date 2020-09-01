<template>
  <el-row
    v-if="nodes.length"
    type="flex"
    align="middle"
  >
    <el-col :span="10">
      <span class="title">Fix Container</span>
    </el-col>

    <el-col :span="7">
      <el-checkbox v-model="autoHeight" />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { AUTO_HEIGHT, TEXT_EDITOR } from '@/const'
import { arrayLast } from '@/utils/array'

export default {
  name: 'AutoHeight',
  computed: {
    ...mapGetters('app', ['selectedComponentNodes']),
    nodes() {
      return this.selectedComponentNodes.filter(
        node => TEXT_EDITOR === node.tag
      )
    },
    allValues() {
      return this.selectedComponentNodes.map(node => node[AUTO_HEIGHT])
    },
    autoHeight: {
      get() {
        return arrayLast(this.allValues)
      },
      set(value) {
        const records = []
        this.selectedComponentNodes.forEach(node => {
          records.push({
            path: `${node.id}.${AUTO_HEIGHT}`,
            value: value || undefined
          })
        })

        this.RECORD(records)
      }
    }
  },
  methods: {
    ...mapMutations('node', ['RECORD'])
  }
}
</script>

<style scoped lang="scss"></style>
