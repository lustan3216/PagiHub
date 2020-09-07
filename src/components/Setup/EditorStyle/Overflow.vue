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
          v-if="canFitContainer"
          label="Fit Container"
          value="fitContainer"
        />
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
import { TEXT_EDITOR } from '@/const'

export default {
  name: 'Overflow',
  mixins: [forNodeMixin('overflow')],
  computed: {
    canFitContainer() {
      return this.nodes.every(node => [TEXT_EDITOR].includes(node.tag))
    }
  }
}
</script>

<style scoped lang="scss"></style>
