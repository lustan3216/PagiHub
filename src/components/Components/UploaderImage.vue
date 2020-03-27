<template>
  <el-button @click="dialogTableVisible = true">
    +
    <el-dialog
      :visible.sync="dialogTableVisible"
      append-to-body
      title="收货地址">
      <el-upload
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </el-dialog>
  </el-button>
</template>

<script>
import { Upload } from 'element-ui'
export default {
  name: 'UploaderImage',
  components: {
    ElUpload: Upload
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      dialogTableVisible: false
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss"></style>
