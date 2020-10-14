<template>
  <el-image
    :style="innerStyles.html"
    v-bind="innerProps"
    :lazy="lazy"
    class="wh-100 over-hidden"
  >
    <div
      slot="error"
      class="el-image__error"
    >
      {{ innerProps.error }}
    </div>
  </el-image>
</template>

<script>
import nodeMixin from '@/components/Templates/mixins/node'
import { defaultSetting } from '../Setup/EditorSetting/SettingFlexImage'
import { Image } from 'element-ui'
import { isComponentSet, isSlider, traversalAncestor } from '@/utils/node'

export default {
  defaultSetting,
  name: 'FlexImage',
  components: {
    ElImage: Image
  },
  mixins: [nodeMixin],
  data() {
    return {
      lazy: true
    }
  },
  created() {
    traversalAncestor(this.node, parentNode => {
      if (isSlider(parentNode)) {
        this.lazy = false
        return false
      }
      else if (isComponentSet(parentNode)) {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
