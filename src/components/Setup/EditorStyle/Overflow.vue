<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col :span="8">
      <span class="title p-r-10">Overflow</span>
    </el-col>

    <el-col :span="16">
      <el-select
        :value="overflow || 'visible'"
        @input="overflow = $event"
      >
        <el-option
          label="Visible"
          value="visible"
        />
        <el-option
          label="Hidden"
          value="hidden"
        />
        <el-option
          label="Scroll"
          value="scroll"
        />
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import forNodeMixin from './mixins/forNode'
import { isGridItem } from '@/utils/node'
export default {
  name: 'Overflow',
  mixins: [forNodeMixin('overflow')],
  computed: {
    nodes() {
      const nodes = []
      this.selectedComponentNodes.filter(node => {
        if (isGridItem(node)) {
          nodes.push(node)
        }
        else if (isGridItem(node.parentNode)) {
          nodes.push(node.parentNode)
        }
      })

      return nodes
    }
  }
}
</script>

<style scoped lang="scss"></style>
