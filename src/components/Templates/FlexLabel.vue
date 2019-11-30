<template>
  <editor :style="innerStyles">
    {{ rule.value }}
  </editor>
</template>

<script>
import commonMixin from '../../mixins/common'
import Editor from './Editor'

export default {
  name: 'FlexLabel',
  components: {
    Editor
  },
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
