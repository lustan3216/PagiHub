<template>
  <el-button :disabled="disabled" :style="innerStyles" class="wh-100 m-0" @click="rootForm.submit">
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexButton',
  mixins: [commonMixin],
  props: {
    text: {
      type: String,
      default: 'Submit'
    }
  },
  inject: ['rootForm'],
  computed: {
    ...mapGetters('nodes', ['childrenOf', 'parentPath']),
    disabled() {
      return !this.rootForm.isValid
    }
  }
}
</script>
