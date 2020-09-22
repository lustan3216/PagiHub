<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col
      :span="8"
      class="title"
    >
      Attachment
    </el-col>
    <el-col :span="16">
      <el-select v-model="backgroundAttachment">
        <el-option value="scroll" />
        <el-option value="fixed" />
        <el-option value="local" />
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundAttachment',
  mixins: [forNode('backgroundAttachment')]
}
</script>

<style scoped lang="scss"></style>
