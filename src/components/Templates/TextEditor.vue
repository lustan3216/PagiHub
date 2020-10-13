<template>
  <text-editor-simple-inner
    :id="id"
    :editing="editing"
    :style="innerStyles.html"
    :value="innerValue"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import TextEditorSimpleInner from './TextEditorSimpleInner'

export default {
  name: 'TextEditor',
  components: {
    TextEditorSimpleInner
  },
  mixins: [nodeMixin],
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  }
}
</script>
