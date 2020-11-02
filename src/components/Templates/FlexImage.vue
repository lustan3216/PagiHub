<template>
  <grid-generator-item :id="id">
    <el-image
      v-bind="innerProps"
      class="wh-100"
      @dblclick.native="dblclick"
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
import { isComponentSet, isSlider, traversalAncestor } from '@/utils/node'
import GridGeneratorItem from '@/components/Templates/GridGeneratorItem'
import { mapMutations } from 'vuex'

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
  },
  methods: {
    ...mapMutations('asset', ['OPEN_ASSET']),
    ...mapMutations('app', { APP_SET: 'SET' }),
    dblclick() {
      this.APP_SET({ beingAddedComponentId: this.id })
      this.OPEN_ASSET()
    }
  }
}
</script>

<style lang="scss" scoped></style>
