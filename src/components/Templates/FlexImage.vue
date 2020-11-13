<template>
  <grid-generator-item
    :id="id"
    data-image-droppable
  >
    <img
      v-if="base64Image"
      :src="base64Image"
      class="wh-100"
    >
    <el-image
      v-else
      v-bind="innerProps"
      lazy
      scroll-container="#art-board"
      class="wh-100"
    >
      <div
        slot="error"
        class="el-image__error"
      >
        {{ innerProps.error }}
      </div>
    </el-image>
  </grid-generator-item>
</template>

<script>
import propsMixin from '@/components/Templates/mixins/props'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexImage'
import { Image } from 'element-ui'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'

export default {
  defaultSetting,
  name: 'FlexImage',
  components: {
    ElImage: Image,
    GridGeneratorItem
  },
  mixins: [propsMixin],
  data() {
    return {
      base64Image: null
    }
  },
  methods: {
    setBase64Preview(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.base64Image = reader.result
      }
      reader.onerror = (error) => {
        throw error
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
