<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col
      :span="8"
      class="title"
    >
      Repeat
    </el-col>
    <el-col :span="16">
      <el-select v-model="backgroundRepeat">
        <el-option value="repeat" />
        <el-option value="repeat-x" />
        <el-option value="repeat-y" />
        <el-option value="no-repeat" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundRepeat',
  mixins: [forNode('backgroundRepeat')]
}
</script>

<style scoped lang="scss"></style>
