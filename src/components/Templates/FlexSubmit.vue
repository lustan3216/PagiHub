<template>
  <el-button
    :disabled="disabled"
    :style="innerStyles"
    class="wh-100 m-0"
    @click="submit"
  >
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script>
import { mapGetters } from 'vuex'
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexSubmit',
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
  },
  methods: {
    submit() {
      this.rootForm.submit()
    }
  }
}
</script>
