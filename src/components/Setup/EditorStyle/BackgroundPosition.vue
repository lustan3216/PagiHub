<template>
  <el-row
    type="flex"
    align="middle"
  >
    <el-col
      :span="8"
      class="title"
    >
      Position
    </el-col>
    <el-col :span="16">
      <el-select v-model="backgroundPosition">
        <el-option
          value="center center"
          label="Center Center"
        />
        <el-option
          value="center top"
          label="Center Top"
        />
        <el-option
          value="center bottom"
          label="Center Bottom"
        />
        <el-option
          value="left top"
          label="left top"
        />
        <el-option
          value="left center"
          label="left center"
        />
        <el-option
          value="left bottom"
          label="left bottom"
        />
        <el-option
          value="right top"
          label="right top"
        />
        <el-option
          value="right center"
          label="right center"
        />
        <el-option
          value="right bottom"
          label="right bottom"
        />
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import forNode from '@/components/Setup/EditorStyle/mixins/forNode'

export default {
  name: 'BackgroundPosition',
  mixins: [forNode('backgroundPosition')]
}
</script>

<style scoped lang="scss"></style>
