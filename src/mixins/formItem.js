import clone from 'clone'
import { mapMutations, mapState } from 'vuex'
import formCreate from '@form-create/element-ui'

export default {
  components: {
    FormItem: formCreate.$form()
  },
  inject: ['rootForm'],
  data() {
    return {
      api: {},
      isValid: false,
      option: { ...this.rootForm.innerProps, submitBtn: { show: false }}
      // option 在form-create不是響應式的，需要透過方法更新
    }
  },
  computed: {
    ...mapState('nodes', ['currentNodesMap']),
    rootProps() {
      return this.rootForm.innerProps
    },
    innerRule() {
      const node = clone(this.currentNodesMap[this.id]) || {}
      const innerRule = node
      const {
        value,
        field,
        showLabel,
        options = [],
        ...props
      } = this.innerProps

      if (this.isEditable) {
        node.on = { change: this.change }
      }

      innerRule.type = this.$options.type
      innerRule.props = props
      innerRule.field = field
      innerRule.options = options.map(label => ({
        label,
        value: label
      }))

      if (node.value !== undefined || value) {
        innerRule.value = node.value || value
      }

      if (showLabel) {
        innerRule.title = field || innerRule.field
      }

      return [innerRule]
    }
  },
  watch: {
    rootProps: {
      handler(value) {
        this.api.updateOptions(value)
      },
      deep: true
    }
  },
  created() {
    if (this.isEditable) {
      this.updateRootData({ isValid: false, value: this.innerRule[0].value })
    }
  },
  methods: {
    ...mapMutations('nodes', ['ASSIGN']),
    change(value) {
      this.api.validate(isValid => {
        this.isValid = isValid
        this.updateRootData({ isValid, value })
      })
    },
    updateRootData({ isValid, value }) {
      const field = this.innerRule[0].field
      this.ASSIGN({ id: this.id, value })
      this.rootForm.updateForm(field, value)
      this.rootForm.updateValid(field, isValid)
    }
  }
}
