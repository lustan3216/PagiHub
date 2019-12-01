<template>
  <form-create
    v-model="api"
    :rule="[innerRule]"
    :option="{ submitBtn: { show: false } }"
  />
</template>

<script>
import { mapMutations } from 'vuex'
import clone from 'clone'
import commonMixin from '../../mixins/common'
import formCreate from '@form-create/element-ui'

export default {
  name: 'FormItem',
  components: {
    FormCreate: formCreate.$form()
  },
  mixins: [commonMixin],
  inject: ['rootForm'],
  props: {
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      api: {},
      isValid: false
    }
  },
  computed: {
    innerRule() {
      let innerRule
      if (this.isEditable) {
        const node = clone(this.$store.state.nodes.currentNodesMap[this.id])
        node.on = { change: this.change }
        innerRule = node
      } else {
        innerRule = clone(this.rule)
      }
      if (innerRule.props && innerRule.props.basic) {
        innerRule.props = innerRule.props.basic
      }
      // if (this.rootForm.innerProps['display-label']) {
      innerRule.title = innerRule.field
      // }
      // console.log(innerRule)
      return innerRule
    }
  },
  created() {
    if (this.isEditable) {
      this.updateRootData({ isValid: false, value: this.innerRule.value })
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
      const field = this.innerRule.field
      this.ASSIGN({ id: this.id, value })
      this.rootForm.updateForm(field, value)
      this.rootForm.updateValid(field, isValid)
    }
  }
}
</script>
