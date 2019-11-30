<template>
  <label :style="innerStyles">
    {{ rule.value }}
  </label>
</template>

<script>
import commonMixin from '../../mixins/common'

export default {
  name: 'FlexLabel',
  mixins: [commonMixin],
  props: {
    rule: {
      type: Object,
      default() {
        return {
          value: ''
        }
      }
    }
  }
}
</script>
