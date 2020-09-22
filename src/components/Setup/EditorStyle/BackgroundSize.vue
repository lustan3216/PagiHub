<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col
      :span="8"
      class="title"
    >
      Size
    </el-col>
    <el-col :span="16">
      <el-select>
        <el-option value="auto" />
        <el-option value="cover" />
        <el-option value="contain" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundSize',
  mixins: [forNode('backgroundSize')]
}
</script>

<style scoped lang="scss"></style>
