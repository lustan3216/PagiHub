<script>
import { getNode } from '@/utils/node'
import { mapActions } from 'vuex'
import { getValueByPath } from '@/utils/tool'

export default {
  name: 'InheritanceController',
  provide() {
    return {
      inheritance: this.inheritance
    }
  },
  inject: {
    isExample: { default: false }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inheritance: {
        inheritParentId: null,
        masterComponentSetId: null
      }
    }
  },
  computed: {
    node() {
      return getNode(this.id)
    }
  },
  created() {
    const masterComponentSetId = getValueByPath(this.node, 'inheritance.masterComponentSetId')

    Object.assign(this.inheritance, {
      inheritParentId: this.id,
      masterComponentSetId
    })

    if (masterComponentSetId) {
      this.getComponentSetChildren(masterComponentSetId)
    }
  },
  methods: {
    ...mapActions('node', ['getComponentSetChildren'])
  },
  render() {
    return this.$slots.default[0]
  }
}
</script>
