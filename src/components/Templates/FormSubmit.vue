<template>
  <el-button
    v-free-style="innerStyles"
    v-if="isDraftMode"
    v-bind="innerProps"
    class="wh-100 m-0 button"
  >
    <editor-text-inner
      :id="id"
      :value="innerValue || 'Submit'"
    />

    <portal :to="`QuickFunctions${id}`">
      <el-tooltip
        effect="light"
        content="Replace all actions in this button for nicer editing UX. It only shows in Draft mode."
        placement="top"
      >
        <el-button
          class="action"
          icon="el-icon-thumb"
          circle
          @click.stop="submit"
        />
      </el-tooltip>
    </portal>
  </el-button>

  <el-button
    v-free-style="innerStyles"
    v-else
    v-bind="innerProps"
    class="wh-100 m-0 button"
    @click="submit"
    v-html="innerValue"
  />
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { INITIATE, PROPS } from '@/const'
import { vmGet } from '@/utils/vmMap'
import { MessageBox } from 'element-ui'
import { isUndefined } from '@/utils/tool'
import { defaultSetting } from '../Setup/EditorSetting/SettingFormSubmit'
import nodeMixin from '@/components/Templates/mixins/node'
import EditorTextInner from '@/components/Templates/TextEditorInner'

export default {
  defaultSetting,
  name: 'FormSubmit',
  components: {
    EditorTextInner
  },
  mixins: [nodeMixin],
  props: {
    text: {
      type: String,
      default: 'Submit'
    }
  },
  computed: {
    ...mapState('node', ['componentsMap']),
    selection() {
      const yetSelectedNodes = []
      const beSelectedNodes = []

      Object.values(this.componentsMap).forEach(node => {
        const validInput =
          node.tag.includes('form') &&
          !node.tag.includes('submit')
        if (validInput) {
          const id = node.props && node.props.submitButtonId

          if (id === this.id) {
            beSelectedNodes.push(node)
          }
          else if (isUndefined(id)) {
            yetSelectedNodes.push(node)
          }
        }
      })

      return {
        yetSelectedNodes,
        beSelectedNodes
      }
    }
  },
  mounted() {
    if (this.isExample || !this.node[INITIATE] || !this.yetSelectedNodes.length) return

    MessageBox.confirm(
      'Is that ok make all unselected input under this button control?',
      'Notice',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'No need',
        type: 'info'
      }
    )
      .then(() => {
        const records = [
          {
            path: `${this.id}.${INITIATE}`,
            value: undefined
          }
        ]
        this.selection.yetSelectedNodes.forEach(node => {
          records.push({
            path: `${node.id}.${PROPS}.submitButtonId`,
            value: this.id
          })
        })
        this.RECORD(records)
      })
      .catch(() => {})
  },
  methods: {
    ...mapMutations('node', ['RECORD']),
    submit() {
      const data = []
      const invalidFields = []
      const { beSelectedNodes } = this.selection
      let valid = true
      for (let i = 0; i < beSelectedNodes.length; i++) {
        const node = beSelectedNodes[i]

        const $f = vmGet(node.id).api
        $f.submit(
          formData => {
            data.push(formData)
          },
          api => {
            invalidFields.push(api.fields()[0])
            valid = false
          }
        )
      }

      if (valid) {
        MessageBox({
          title: 'Submit success',
          confirmButtonText: 'OK',
          message: JSON.stringify(data)
        })
      }
      else {
        MessageBox({
          title: 'From is invalid',
          confirmButtonText: 'OK',
          message: JSON.stringify(invalidFields)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
.action {
  right: -5px;
  top: -5px;
  position: absolute;
  padding: 5px;
}
</style>
