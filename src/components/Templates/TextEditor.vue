<template>
  <text-editor-inner

    :id="id"
    :editing="editing"
    :value="innerValue"
  />
</template>

<script>
import nodeMixin from './mixins/node'
import TextEditorInner from './TextEditorInner'
export default {
  name: 'TextEditor',
  components: {
    TextEditorInner
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
