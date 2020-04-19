<template>
  <div>
    <span class="el-dropdown">Background</span>

    <el-row
      :gutter="5"
      class="m-t-10"
    >
      <el-col :span="8">
        <el-color-picker v-model="backgroundColor" />
        <span class="el-form-item__label">Color</span>
      </el-col>

      <el-col :span="8">
        <uploader-image />
        <span class="el-form-item__label">Repeat</span>
      </el-col>

      <el-col :span="8">

        <el-select>
          <el-option value="repeat" />
          <el-option value="repeat-x" />
          <el-option value="repeat-y" />
          <el-option value="no-repeat" />
        </el-select>
        <span class="el-form-item__label">Repeat</span>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-select>
          <el-option value="left top" />
          <el-option value="left center" />
          <el-option value="left bottom" />
          <el-option value="right top" />
          <el-option value="right center" />
          <el-option value="right bottom" />
          <el-option value="center top" />
          <el-option value="center center" />
          <el-option value="center bottom" />
        </el-select>
        <span class="el-form-item__label">position</span>
      </el-col>

      <el-col :span="8">
        <el-select>
          <el-option value="scroll" />
          <el-option value="fixed" />
          <el-option value="local" />
        </el-select>
        <span class="el-form-item__label">attachment</span>
      </el-col>

      <el-col :span="8">
        <el-select>
          <el-option value="auto" />
          <el-option value="cover" />
          <el-option value="contain" />
        </el-select>
        <span class="el-form-item__label">size</span>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import UploaderImage from '@/components/Components/UploaderImage'

export default {
  name: 'Background',
  components: {
    UploaderImage
  }
}
</script>

<style scoped lang="scss">
label {
  display: block;
}
</style>
