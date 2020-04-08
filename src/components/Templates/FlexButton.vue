<template>
  <el-button class="wh-100 m-0 button">
    <editor-text
      v-if="isDraftMode"
      :id="id"
      :only="['bold', 'italic', 'fontColor', 'font', 'underline', 'strike']"
      v-model="innerValue"
    />
    <div
      v-else
      v-html="innerValue"
    />
  </el-button>
</template>

<script>
import nodeMixin from '../../mixins/node'
import EditorText from './EditorText'
import store from '../../store'

export default {
  name: 'FlexButton',
  components: {
    EditorText
  },
  mixins: [nodeMixin],
  props: {
    defaultText: {
      type: String,
      default: 'Edit me'
    }
  },
  data() {
    const node = store.state.draft.nodesMap[this.id]
    return {
      innerValue: (!this.isExample && node && node.value) || this.defaultText
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-area {
  height: 100%;
}
::v-deep.button {
  & .ql-editor,
  & .ql-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ql-editor {
    padding: 0;
    min-height: inherit;
  }
}
</style>
