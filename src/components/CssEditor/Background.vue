<template>
  <div>
    <el-color-picker v-model="backgroundColor" />

    <uploader-image />

    <label>
      background-repeat
    </label>

    <el-select name="background-repeat">
      <el-option value="repeat" />
      <el-option value="repeat-x" />
      <el-option value="repeat-y" />
      <el-option value="no-repeat" />
    </el-select>

    <label>
      background-position
    </label>

    <el-select name="background-position">
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

    <label>
      attachment
    </label>

    <el-select name="background-attachment">
      <el-option value="scroll" />
      <el-option value="fixed" />
      <el-option value="local" />
    </el-select>

    <label>
      background-size
    </label>

    <el-select name="background-size">
      <el-option value="auto" />
      <el-option value="cover" />
      <el-option value="contain" />
    </el-select>
  </div>
</template>

<script>
import styleMixin from '../../mixins/style'
import styleOneAttrMixin from '../../mixins/styleOneAttr'
import UploaderImage from '../Components/UploaderImage'

export default {
  name: 'Background',
  components: {
    UploaderImage
  },
  mixins: [styleMixin, styleOneAttrMixin('backgroundColor')]
}
</script>

<style scoped lang="scss">
label {
  display: block;
}
</style>
